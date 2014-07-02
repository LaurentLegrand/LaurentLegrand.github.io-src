---
layout: post
title: "Octopress on Raspberry Pi"
date: 2014-07-02 21:36:07 +0200
comments: true
categories: 
resources: resources/2014-07-02-octopress-on-raspberry-pi
---

I *moved* my blog sources to a raspberry pi running Linux raspberrypi 3.10.25+

I've faced the following issues:

* During `bundle install`: An error occured while installing RedCloth (4.2.9)

    Solved by this answer http://stackoverflow.com/a/14353864

* Then problem with pygments_code like in http://stackoverflow.com/questions/16517144/why-the-pygments-code-rb-plugin-is-breaking
  
    Solved by deleting `.pygments_cache` folder: https://github.com/imathis/octopress/issues/1427

* Then gist redirect by github
    
    Solved by updating `plugins/gist_tab.rb`

The site generation is rather slow but it works!

