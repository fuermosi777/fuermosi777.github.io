---
layout: default
permalink: /
---

<div class="main-content">
  {% for post in site.posts %}
    {% if post.category == 'English' %}
    {% include post_preview.html post=post %}
    {% endif %}
  {% endfor %}
</div>
