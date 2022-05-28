---
layout: default
---

<div class="main-content">
  <div class="list-space">
    {% for p in site.posts %}
      {% if p.category == 'English' %}
        <div class="list-item">
          <div class="col-1 small-text date">
            {{ p.date | date: '%m/%Y' }}
          </div>
          <div class="col-3 medium-text"> 
            <a href="{{ p.url }}">{{ p.title }}</a>
          </div>
        </div>
      {% endif %}
    {% endfor %}
  </div>
</div>

