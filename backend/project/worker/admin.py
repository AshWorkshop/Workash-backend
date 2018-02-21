from django.contrib import admin

from project.worker.models import Worker
from project.worker.models import Work


admin.site.register(Worker)
admin.site.register(Work)
