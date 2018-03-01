from django.contrib import admin

from project.worker.models import Worker
from project.worker.models import Work
from project.worker.models import Project


admin.site.register(Worker)
admin.site.register(Work)
admin.site.register(Project)
