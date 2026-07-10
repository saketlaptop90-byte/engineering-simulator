import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MACHINES } from './machines.js';

// ─── Searchable Model Picker ───
class ModelSearch {
    constructor(inputId, dropdownId, badgeId, badgeNameId, badgeClearId, emptyId, onSelect) {
        this.input = document.getElementById(inputId);
        this.dropdown = document.getElementById(dropdownId);
        this.badge = document.getElementById(badgeId);
        this.badgeName = document.getElementById(badgeNameId);
        this.badgeClear = document.getElementById(badgeClearId);
        this.emptyEl = document.getElementById(emptyId);
        this.onSelect = onSelect;
        this.highlightIndex = -1;
        this.currentResults = [];
        this.selectedId = null;

        this.input.addEventListener('input', () => this.onInput());
        this.input.addEventListener('focus', () => { if (this.input.value.length > 0) this.onInput(); });
        this.input.addEventListener('keydown', (e) => this.onKeydown(e));
        this.badgeClear.addEventListener('click', () => this.clearSelection());

        // Close dropdown on outside click
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
                this.hideDropdown();
            }
        });
    }

    onInput() {
        const query = this.input.value.trim().toLowerCase();
        if (query.length < 1) {
            this.hideDropdown();
            return;
        }

        // Search by name and category
        this.currentResults = MACHINES.filter(m => 
            m.name.toLowerCase().includes(query) || 
            (m.category && m.category.toLowerCase().includes(query)) ||
            m.id.toLowerCase().includes(query)
        ).slice(0, 50); // Limit to 50 results for performance

        this.highlightIndex = -1;
        this.renderResults();
    }

    renderResults() {
        if (this.currentResults.length === 0) {
            this.dropdown.innerHTML = '<div class="no-results">No models found</div>';
        } else {
            this.dropdown.innerHTML = this.currentResults.map((m, i) => `
                <div class="dropdown-item${i === this.highlightIndex ? ' highlighted' : ''}" data-index="${i}" data-id="${m.id}">
                    <span class="item-icon">${m.icon || '⚙️'}</span>
                    <span class="item-name">${this.highlightMatch(m.name, this.input.value.trim())}</span>
                    <span class="item-cat">${(m.category || '').replace(/_/g, ' ')}</span>
                </div>
            `).join('');

            // Attach click handlers
            this.dropdown.querySelectorAll('.dropdown-item').forEach(el => {
                el.addEventListener('click', () => {
                    const idx = parseInt(el.dataset.index);
                    this.selectItem(idx);
                });
            });
        }
        this.showDropdown();
    }

    highlightMatch(text, query) {
        if (!query) return text;
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return text;
        return text.substring(0, idx) + '<strong style="color:#00e5ff">' + text.substring(idx, idx + query.length) + '</strong>' + text.substring(idx + query.length);
    }

    onKeydown(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.highlightIndex < this.currentResults.length - 1) {
                this.highlightIndex++;
                this.renderResults();
                this.scrollToHighlighted();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.highlightIndex > 0) {
                this.highlightIndex--;
                this.renderResults();
                this.scrollToHighlighted();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.highlightIndex >= 0 && this.highlightIndex < this.currentResults.length) {
                this.selectItem(this.highlightIndex);
            }
        } else if (e.key === 'Escape') {
            this.hideDropdown();
        }
    }

    scrollToHighlighted() {
        const el = this.dropdown.querySelector('.highlighted');
        if (el) el.scrollIntoView({ block: 'nearest' });
    }

    selectItem(index) {
        const machine = this.currentResults[index];
        if (!machine) return;
        
        this.selectedId = machine.id;
        this.input.value = '';
        this.hideDropdown();
        
        // Show badge
        this.badgeName.textContent = `${machine.icon || '⚙️'} ${machine.name}`;
        this.badge.classList.add('visible');
        
        // Hide empty state
        if (this.emptyEl) this.emptyEl.style.display = 'none';
        
        this.onSelect(machine.id);
    }

    clearSelection() {
        this.selectedId = null;
        this.badge.classList.remove('visible');
        if (this.emptyEl) this.emptyEl.style.display = '';
        this.onSelect(null);
    }

    showDropdown() {
        this.dropdown.classList.add('visible');
    }

    hideDropdown() {
        this.dropdown.classList.remove('visible');
    }
}

// ─── 3D Viewer ───
class Viewer {
    constructor(containerId, loaderId) {
        this.container = document.getElementById(containerId);
        this.loaderEl = document.getElementById(loaderId);
        
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(5, 5, 5);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.container.appendChild(this.renderer.domElement);
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(5, 10, 7.5);
        this.scene.add(dirLight);
        
        this.currentModel = null;
        
        window.addEventListener('resize', () => this.onWindowResize(), false);
        this.animate();
    }
    
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    async loadModel(modelId) {
        // Clear current model
        if (this.currentModel) {
            this.scene.remove(this.currentModel);
            this.currentModel = null;
        }
        
        if (!modelId) return; // Cleared selection
        
        const machineEntry = MACHINES.find(m => m.id === modelId);
        if (!machineEntry) return;
        
        this.loaderEl.style.display = 'block';
        this.loaderEl.innerText = 'Loading Model...';
        
        try {
            let createFn = machineEntry.create;
            if (machineEntry.importPath) {
                const mod = await import(machineEntry.importPath);
                createFn = mod.createMachine || mod[machineEntry.importName];
            }
            if (!createFn) throw new Error('No create function found');
            
            const data = createFn(THREE, machineEntry.id);
            let actualGroup = data.group || data.model || data;
            
            this.currentModel = actualGroup;
            
            // Center and scale
            const box = new THREE.Box3().setFromObject(this.currentModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = maxDim > 0 && maxDim < 10000 ? 5 / maxDim : 1;
            
            this.currentModel.scale.setScalar(scale);
            this.currentModel.position.sub(center.multiplyScalar(scale));
            
            this.scene.add(this.currentModel);
            this.loaderEl.style.display = 'none';
        } catch (error) {
            console.error('Error loading model:', error);
            this.loaderEl.innerText = 'Error loading model';
            setTimeout(() => { this.loaderEl.style.display = 'none'; }, 3000);
        }
    }
}

// ─── Initialize ───
const viewer1 = new Viewer('container-1', 'loader-1');
const viewer2 = new Viewer('container-2', 'loader-2');

new ModelSearch('search-1', 'dropdown-1', 'badge-1', 'badge-name-1', 'badge-clear-1', 'empty-1', (id) => viewer1.loadModel(id));
new ModelSearch('search-2', 'dropdown-2', 'badge-2', 'badge-name-2', 'badge-clear-2', 'empty-2', (id) => viewer2.loadModel(id));
