---
layout: post
title: Naming MQTT Topics
date: 2013-11-30 23:54:29 +0100
comments: true
categories: mqtt
---

This post is an attempt to define a naming convention for MQTT topic that combines physical and location information. 

<!--more-->


``` antlr A kind of naming convention
topic : '/' class '/' id '/' direction '/' command '/' declaringClass '/' feature (qualifiedName)?;
direction : 'in' | 'out';
command : 'get' | 'set' | 'unset' | 'val' | 'op';
qualifiedName : ( '/' STRING )+;
```

Where

* `class`: the class of the device
* `id`: the unique id of the device
* `direction` indicates the direction of the message
   * `'in'`: the message goes to the device
   * `'out'`: the message goes from the device
* `command`: the command to execute
   * `'get'`: get the value of the feature
   * `'set'`: set the value of the feature
   * `'unset'`: unset the value of the feature
   * `'val'`: send the value of the feature
   * `'op'`: execute an operation on the device
* `declaringClass`: the class in which the feature is declared
* `feature`: the feature (property or operation)
* `qualifiedName`: the fully qualified name of the device


## Examples

### Machine case

* A `Machine` has a property `freeMemory`
* A `JavaVirtualMachine` is a `Machine`
* A `JavaVirtualMachine` has an operation called `gc` which runs the garbage collecor
* There is an instance of a `JavaVirtualMachine` with
	* id is 42 
	* is deployed on a host called `myhost`
	* is running a web app called `mywebapp`
	* qualifiedName is `/myhost/mywebapp`

* The `JavaVirtualMachine` 42 would publish its free memory on topic 
	`/JavaVirtualMachine/42/out/val/Machine/freeMemory/myhost/mywebapp`
* In order to receive operation call, the `JavaVirtualMachine` 42 would subscibe to topics 
	* `/JavaVirtualMachine/42/in/op/#`; if `id` is kind of UUID, it could only subscribe to `/+/42/in/#`
	* and to `/+/+/in/op/+/+/myhost/mywebapp`
* An application would subscribe to
	* `/+/+/out/val/Machine/freeMemory/#` to receive `freeMemory` values from any instance of `Machine`
	* `/JavaVirtualMachine/+/out/val/Machine/freeMemory/#` to receive `freeMemory` values from any instance of `JavaVirtualMachine`
	* `/+/+/out/val/Machine/freeMemory/myhost/#` to receive `freeMemory` values from any instance deployed on `myhost`
* An application would publish to `/JavaVirtualMachine/42/in/op/JavaVirtualMachine/gc` to run the gc on JVM 42



Not tested but it should work ...

