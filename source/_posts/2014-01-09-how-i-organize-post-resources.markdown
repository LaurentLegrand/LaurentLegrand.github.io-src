---
layout: post
title: "How I Organize Post Resources"
date: 2014-01-09 23:08:45 +0100
comments: true
categories: octopress
resources: resources/2014-01-09-how-i-organize-post-resources
---

When a post uses additional resources (images, javascript, pdf), I put them 
in a directory with the same name as the post filename but without the file extension.

For instance, for the current post, `2014-01-09-how-i-organize-post-resources`, resources
would be in the directory `resources/2014-01-09-how-i-organize-post-resources`.

In order to _industrialize_ the creation of the resource directory, I've changed 
the `new_post` task in the `Rakefile` in order to

* create the resource directory
* add the variable `resources` in the [front-matter](http://jekyllrb.com/docs/frontmatter/) of the new post

At the end, in a post, I just have to use the variables `site_url` and `page.resources` to
reference a resource.

{% raw %} 
For instance, a link to the file `test.pdf` would be written `{{ root_url }}/{{ page.resources }}/test.pdf`.
{% endraw %} 
And would be rendered `{{ root_url }}/{{ page.resources }}/test.pdf`.



    


