---
layout: default
---

<div class="main-content">
  {% for p in site.posts %}
    {% if p.category == 'English' %}
      <div class="list-item">
        <div class="small-text m-r m-b">
          {{ p.date | date: '%m/%Y' }}
        </div>
        <div class="medium-text"> 
          <a href="{{ p.url }}">{{ p.title }}</a>
        </div>
      </div>
    {% endif %}
  {% endfor %}
</div>

