from django.db import models

class Provincia(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

class Municipio(models.Model):
    nome = models.CharField(max_length=100)
    provincia = models.ForeignKey(Provincia, related_name='municipios', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nome} ({self.provincia.nome})"

class Comuna(models.Model):
    nome = models.CharField(max_length=100)
    municipio = models.ForeignKey(Municipio, related_name='comunas', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nome} ({self.municipio.nome})"
