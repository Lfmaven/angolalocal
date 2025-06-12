import csv
from django.core.management.base import BaseCommand
from core.models import Provincia, Municipio, Comuna
from django.db import transaction

class Command(BaseCommand):
    help = 'Importa províncias, municípios e comunas de Angola a partir de um arquivo CSV'

    def add_arguments(self, parser):
        parser.add_argument('caminho_csv', type=str, help='Caminho para o arquivo CSV')

    @transaction.atomic
    def handle(self, *args, **kwargs):
        caminho_csv = kwargs['caminho_csv']

        with open(caminho_csv, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            total = 0

            for row in reader:
                prov_nome = row['provincia'].strip()
                munic_nome = row['municipio'].strip()
                comuna_nome = row['comuna'].strip()

                provincia, _ = Provincia.objects.get_or_create(nome=prov_nome)
                municipio, _ = Municipio.objects.get_or_create(nome=munic_nome, provincia=provincia)
                Comuna.objects.get_or_create(nome=comuna_nome, municipio=municipio)
                total += 1

        self.stdout.write(self.style.SUCCESS(f'✅ {total} comunas importadas com sucesso!'))
