---
layout: default
---

<div class="main-content">
  <div class="list-group">
    {% for p in site.posts %}
      {% if p.category == 'English' %}
        <div class="list-item m-b">
          <div class="small-text m-r">
            {{ p.date | date: '%m/%Y' }}
          </div>
          <div class="medium-text"> 
            <a href="{{ p.url }}">{{ p.title }}</a>
          </div>
        </div>
      {% endif %}
    {% endfor %}
  </div>
</div>
