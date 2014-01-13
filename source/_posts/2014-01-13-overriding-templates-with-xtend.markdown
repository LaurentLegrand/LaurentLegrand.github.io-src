---
layout: post
title: "Overriding Templates with XTend"
date: 2014-01-13 22:30:53 +0100
comments: true
categories: 
resources: resources/2014-01-13-overriding-templates-with-xtend
---

On some project, I generate code from EMF models. And I've been faced to the following issue:
overriding a template for classes in different EMF meta-models which are in separated Eclipse plug-ins.

It was similar to the following example: the template `Foo` 
which needs to be override for each class in that class hierarchy (colors correspond to different Eclipse plug-ins)

<img src="http://yuml.me/diagram/scruffy/class/[a.A{bg:blue}]^-[a.A_1{bg:blue}], [a.A]^-[a.A_2{bg:blue}], [a.A_1]^-[b.B{bg:orange}], [a.A_2]^-[c.C{bg:green}], [b.B]^-[b.B_1{bg:orange}], [b.B]^-[b.B_2{bg:orange}], [c.C]^-[c.C_1{bg:green}], [c.C]^-[c.C_2{bg:green}]"></img>

<!--more-->

## First try: multiple dispatch

With Xtend, a classical approach is to use the multiple dispatch feature:

{% codeblock Multiple Dispatch lang:xtend %}
class Foo {

	public static def dispatch foo(a.A e) '''a.A'''
	
	public static def dispatch foo(a.A_1 e) '''a.A_1'''
	
	public static def dispatch foo(b.B e) '''b.B'''
	
	public static def dispatch foo(c.C e) '''c.C'''
	
	// and so on
	
}
{% endcodeblock %}

It works fine but all template specializations have to be declared in the same Xtend class. And it might not be possible. 
For instance, in the example, we would have created an additional Eclipse plug-in containing all templates. 

## Second try: Eclipse extension point / extensions

As I want to group template specializations per Eclipse plug-in, I looked at the extension point / extensions mechanism.

For the example, I would have declared:

* an extension point for the root template declared in plug-in `a`
* an extension for classes from package `b` declared in plug-in `b`
* an extension for classes from package `c` declared in plug-in `c`

It would work but it is quite tedious: tons of XML and lots of plumbing code; not manageable if you have several templates to override.

## Final try: a combination of lambda expression and multiple dispatch

Since the previous attempts have some drawbacks, I've defined the following technique which combines lambda expressions and multiple dispatch
with the help of two small classes.

### First helper class: `Transformer`

First, I have declare the class `Transformer` that transforms an object instance into another one:

``` xtend Transformer https://raw.github.com/LaurentLegrand/ollabaca-on/master/org.ollabaca.on.site/src/org/ollabaca/on/site/util/Transformer.xtend
class Transformer {

import java.util.SortedMap
import java.util.TreeMap

class Transformer<I, O> {

	val (I)=>O fallback

	val SortedMap<Class<? extends I>, (I)=>O> transformers = new TreeMap(
		[ Class<? extends I> a, b | // most specific class, first
			if (a == b) {
				return 0
			}
			if (a.isAssignableFrom(b)) {
				return 1
			}
			return -1
		])

	public new() {
		this.fallback = null
	}

	public new((I)=>O fallback) {
		this.fallback = fallback
	}

	public def register(Class<? extends I> type, (I)=>O transformer) {
		transformers.put(type, transformer)
	}

	public def O transform(I self) {
		for (e : transformers.entrySet) {
			try {
				if (e.key.isInstance(self)) {
					val o = e.value.apply(self)
					if (o != null) {
						return o
					}
				}
			} catch (IllegalArgumentException ex) {
				ex.printStackTrace
			}
		}
		try {
			return self.doFallback
		} catch (IllegalArgumentException ex) {
			ex.printStackTrace
		}
		return null
	}

	protected def O doFallback(I self) {
		if (this.fallback != null) {
			return this.fallback.apply(self)
		}
	}
}
``` 

It contains the following members:

* `transfomers`: a map of lambda expressions to which a `Transformer` instance delegates the transformation
* `fallback`: a fallback lambda expression if no transformer is found; `doFallback` could also be override instead
* `register` an helper method used to register a transformer lambda expression; 
   the first parameter of that method corresponds to the root class that the lambda expression is able to transform
* `transform`: the method that does the transformation

### Second helper class: `Template` 

The second helper class is the class `Template` which specializes the class `Transformer` by trasforming into a `CharSequence`.

``` xtend Template https://raw.github.com/LaurentLegrand/ollabaca-on/master/org.ollabaca.on.site/src/org/ollabaca/on/site/util/Template.xtend
class Template<E> extends Transformer<E, CharSequence> {

	public new() { }
        
	public new((E) => CharSequence fallback) {
 		super(fallback)
	}
        
}
```



### Some conventions and that's it

Finally, when I need a template, I

* declare a singleton class which extends `Template` 
* declare dispatch `doFallback` methods for each class in the root package
* declare an helper method with this convention `<template-name>_<root-class-name>`

For instance, the template `Foo` would be:

{% codeblock Foo lang:xtend %}
package a

class Foo extends Template<A> {

	public static val Foo instance = new Foo()
	
	// the helper method
	static def foo_A(A self) {
		instance.transform(self)
	}
	
	// the fallback methods
	def dispatch doFallback(A e) '''a.A'''
	
	def dispatch doFallback(A_1 e) '''a.A_1'''
		
}
{% endcodeblock %}

Then, if I need to override the default templates in another Eclipse plug-in, I

* declare a class with the same name as the helper class in the root template
* declare a `register` method that registers to the root template
* declare dispatch methods for each template to override; these methods must have the same signature than the `transform` method

For instance, the extension of `Foo` in Eclipse plug-in `b` would be:

{% codeblock Foo lang:xtend %}
package b

class Foo_A { // no need to extend anything!

	static def register() {
		a.Foo::instance.register(typeof(b), [foo_A])
	}
	
	// useless but mandatory
	static def dispatch foo_A(a.A self) { }
	
	
	static def dispatch foo_A(B self) '''b.B'''
	
	static def dispatch foo_A(B_1 self) '''b.B_1'''
		
}
{% endcodeblock %}

## Last words

With that technique, overriding templates is quite easy. 
The only constraint is to respect the signature of the lambda expression required by the `Transformer` class.
Furthermore, you are free to organize your template extensions the way you want.

