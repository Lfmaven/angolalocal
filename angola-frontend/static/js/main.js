        const API_URL = 'http://localhost:8000/api';
        let todosMunicipios = [];
        let todasProvincias = [];
        let currentPage = {
            provincias: 1,
            municipios: 1,
            comunas: 1
        };
        let totalPages = {
            provincias: 1,
            municipios: 1,
            comunas: 1
        };

        window.onload = async () => {
            await carregarProvinciasParaFiltros();
            await carregarMunicipiosParaFiltros();
            await buscarProvincias();
            await buscarMunicipios();
            await buscarComunas();
        };

        function openTab(tabName) {
            // Esconde todos os conteúdos das abas
            const tabContents = document.getElementsByClassName('tab-content');
            for (let i = 0; i < tabContents.length; i++) {
                tabContents[i].classList.remove('active');
            }

            // Remove a classe 'active' de todas as abas
            const tabs = document.getElementsByClassName('tab');
            for (let i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove('active');
            }

            // Mostra o conteúdo da aba selecionada e marca a aba como ativa
            document.getElementById(tabName).classList.add('active');
            event.currentTarget.classList.add('active');
        }

        async function carregarProvinciasParaFiltros() {
            try {
                const resp = await fetch(`${API_URL}/provincias/`);
                const data = await resp.json();
                const provincias = data.results || data;
                todasProvincias = provincias;
                
                // Preenche o select de províncias para municípios
                const selectMunicipio = document.getElementById('filtroProvinciaMunicipio');
                selectMunicipio.innerHTML = '<option value="">Todas</option>';
                provincias.forEach(p => {
                    selectMunicipio.innerHTML += `<option value="${p.id}">${p.nome}</option>`;
                });
                
                // Preenche o select de províncias para comunas
                const selectComuna = document.getElementById('filtroProvinciaComuna');
                selectComuna.innerHTML = '<option value="">Todas</option>';
                provincias.forEach(p => {
                    selectComuna.innerHTML += `<option value="${p.id}">${p.nome}</option>`;
                });
            } catch (error) {
                console.error('Erro ao carregar províncias:', error);
            }
        }

        async function carregarMunicipiosParaFiltros() {
            try {
                const resp = await fetch(`${API_URL}/municipios/`);
                const data = await resp.json();
                todosMunicipios = data.results || data;
                preencherMunicipios(todosMunicipios, 'filtroMunicipioComuna');
            } catch (error) {
                console.error('Erro ao carregar municípios:', error);
            }
        }

        function preencherMunicipios(municipios, selectId) {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Todos</option>';
            municipios.forEach(m => {
                const provinciaNome = todasProvincias.find(p => p.id === m.provincia)?.nome || m.provincia;
                select.innerHTML += `<option value="${m.id}" data-provincia="${m.provincia}">${m.nome} (${provinciaNome})</option>`;
            });
        }

        function filtrarMunicipiosPorProvincia() {
            const provinciaId = document.getElementById('filtroProvinciaMunicipio').value;
            buscarMunicipios();
        }

        function filtrarMunicipiosPorProvinciaComuna() {
            const provinciaId = document.getElementById('filtroProvinciaComuna').value;
            const selectMunicipio = document.getElementById('filtroMunicipioComuna');
            
            if (!provinciaId) {
                preencherMunicipios(todosMunicipios, 'filtroMunicipioComuna');
            } else {
                const filtrados = todosMunicipios.filter(m => m.provincia === parseInt(provinciaId));
                preencherMunicipios(filtrados, 'filtroMunicipioComuna');
            }
            
            buscarComunas();
        }

        async function buscarProvincias(page = 1) {
            try {
                currentPage.provincias = page;
                document.getElementById('loadingProvincias').style.display = 'block';
                document.getElementById('errorProvincias').style.display = 'none';
                
                const nome = document.getElementById('provinciaNome').value;
                let url = `${API_URL}/provincias/?page=${page}`;
                
                if (nome) {
                    url += `&search=${nome}`;
                }
                
                const resp = await fetch(url);
                const data = await resp.json();
                
                const provincias = data.results || data;
                const tbody = document.getElementById('tabelaProvincias');
                tbody.innerHTML = '';
                
                provincias.forEach(p => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${p.id}</td>
                            <td>${p.nome}</td>
                            <td>${p.codigo || 'N/A'}</td>
                        </tr>
                    `;
                });
                
                // Atualiza paginação
                totalPages.provincias = data.total_pages || 1;
                atualizarPaginacao('paginacaoProvincias', 'provincias', totalPages.provincias, page);
                
            } catch (error) {
                console.error('Erro ao buscar províncias:', error);
                document.getElementById('errorProvincias').style.display = 'block';
                document.getElementById('errorProvincias').textContent = 'Erro ao carregar províncias. Tente novamente.';
            } finally {
                document.getElementById('loadingProvincias').style.display = 'none';
            }
        }

        async function buscarMunicipios(page = 1) {
            try {
                currentPage.municipios = page;
                document.getElementById('loadingMunicipios').style.display = 'block';
                document.getElementById('errorMunicipios').style.display = 'none';
                
                const nome = document.getElementById('municipioNome').value;
                const provinciaId = document.getElementById('filtroProvinciaMunicipio').value;
                let url = `${API_URL}/municipios/?page=${page}`;
                
                if (nome) {
                    url += `&search=${nome}`;
                }
                if (provinciaId) {
                    url += `&provincia=${provinciaId}`;
                }
                
                const resp = await fetch(url);
                const data = await resp.json();
                
                const municipios = data.results || data;
                const tbody = document.getElementById('tabelaMunicipios');
                tbody.innerHTML = '';
                
                municipios.forEach(m => {
                    const provinciaNome = todasProvincias.find(p => p.id === m.provincia)?.nome || m.provincia;
                    tbody.innerHTML += `
                        <tr>
                            <td>${m.id}</td>
                            <td>${m.nome}</td>
                            <td>${provinciaNome}</td>
                        </tr>
                    `;
                });
                
                // Atualiza paginação
                totalPages.municipios = data.total_pages || 1;
                atualizarPaginacao('paginacaoMunicipios', 'municipios', totalPages.municipios, page);
                
            } catch (error) {
                console.error('Erro ao buscar municípios:', error);
                document.getElementById('errorMunicipios').style.display = 'block';
                document.getElementById('errorMunicipios').textContent = 'Erro ao carregar municípios. Tente novamente.';
            } finally {
                document.getElementById('loadingMunicipios').style.display = 'none';
            }
        }

        async function buscarComunas(page = 1) {
            try {
                currentPage.comunas = page;
                document.getElementById('loadingComunas').style.display = 'block';
                document.getElementById('errorComunas').style.display = 'none';
                
                const nome = document.getElementById('comunaNome').value;
                const municipioId = document.getElementById('filtroMunicipioComuna').value;
                let url = `${API_URL}/comunas/?page=${page}`;
                
                if (nome) {
                    url += `&search=${nome}`;
                }
                if (municipioId) {
                    url += `&municipio=${municipioId}`;
                }
                
                const resp = await fetch(url);
                const data = await resp.json();
                
                const comunas = data.results || data;
                const tbody = document.getElementById('tabelaComunas');
                tbody.innerHTML = '';
                
                comunas.forEach(c => {
                    const municipio = todosMunicipios.find(m => m.id === c.municipio) || { nome: c.municipio, provincia: 'N/A' };
                    const provinciaNome = todasProvincias.find(p => p.id === municipio.provincia)?.nome || municipio.provincia;
                    
                    tbody.innerHTML += `
                        <tr>
                            <td>${c.id}</td>
                            <td>${c.nome}</td>
                            <td>${municipio.nome}</td>
                            <td>${provinciaNome}</td>
                        </tr>
                    `;
                });
                
                // Atualiza paginação
                totalPages.comunas = data.total_pages || 1;
                atualizarPaginacao('paginacaoComunas', 'comunas', totalPages.comunas, page);
                
            } catch (error) {
                console.error('Erro ao buscar comunas:', error);
                document.getElementById('errorComunas').style.display = 'block';
                document.getElementById('errorComunas').textContent = 'Erro ao carregar comunas. Tente novamente.';
            } finally {
                document.getElementById('loadingComunas').style.display = 'none';
            }
        }

        function atualizarPaginacao(elementId, tipo, totalPages, currentPage) {
            const paginacao = document.getElementById(elementId);
            paginacao.innerHTML = '';
            
            if (totalPages <= 1) return;
            
            // Botão anterior
            if (currentPage > 1) {
                const prevButton = document.createElement('button');
                prevButton.textContent = '«';
                prevButton.onclick = () => {
                    if (tipo === 'provincias') buscarProvincias(currentPage - 1);
                    if (tipo === 'municipios') buscarMunicipios(currentPage - 1);
                    if (tipo === 'comunas') buscarComunas(currentPage - 1);
                };
                paginacao.appendChild(prevButton);
            }
            
            // Números das páginas
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);
            
            for (let i = startPage; i <= endPage; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                if (i === currentPage) {
                    pageButton.classList.add('active');
                } else {
                    pageButton.onclick = () => {
                        if (tipo === 'provincias') buscarProvincias(i);
                        if (tipo === 'municipios') buscarMunicipios(i);
                        if (tipo === 'comunas') buscarComunas(i);
                    };
                }
                paginacao.appendChild(pageButton);
            }
            
            // Botão próximo
            if (currentPage < totalPages) {
                const nextButton = document.createElement('button');
                nextButton.textContent = '»';
                nextButton.onclick = () => {
                    if (tipo === 'provincias') buscarProvincias(currentPage + 1);
                    if (tipo === 'municipios') buscarMunicipios(currentPage + 1);
                    if (tipo === 'comunas') buscarComunas(currentPage + 1);
                };
                paginacao.appendChild(nextButton);
            }
        }