import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Setup basic environment
const machines = window.ENGISIM_MACHINES || [];

function populateSelects() {
    const s1 = document.getElementById('select-1');
    const s2 = document.getElementById('select-2');
    
    machines.forEach(m => {
        const o1 = document.createElement('option');
        o1.value = m.id;
        o1.textContent = m.name;
        s1.appendChild(o1);
        
        const o2 = document.createElement('option');
        o2.value = m.id;
        o2.textContent = m.name;
        s2.appendChild(o2);
    });
}

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
    
    loadModel(modelId) {
        if (this.currentModel) {
            this.scene.remove(this.currentModel);
            this.currentModel = null;
        }
        
        const machine = machines.find(m => m.id === modelId);
        if (!machine) return;
        
        this.loaderEl.style.display = 'block';
        
        const loader = new GLTFLoader();
        loader.load(machine.modelUrl, (gltf) => {
            this.currentModel = gltf.scene;
            
            // Center and scale
            const box = new THREE.Box3().setFromObject(this.currentModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 5 / maxDim;
            
            this.currentModel.scale.setScalar(scale);
            this.currentModel.position.sub(center.multiplyScalar(scale));
            
            this.scene.add(this.currentModel);
            this.loaderEl.style.display = 'none';
        }, undefined, (error) => {
            console.error('Error loading model:', error);
            this.loaderEl.innerText = 'Error loading model';
            setTimeout(() => { this.loaderEl.style.display = 'none'; }, 3000);
        });
    }
}

// Initialize Viewers
const viewer1 = new Viewer('container-1', 'loader-1');
const viewer2 = new Viewer('container-2', 'loader-2');

populateSelects();

document.getElementById('select-1').addEventListener('change', (e) => {
    viewer1.loadModel(e.target.value);
});

document.getElementById('select-2').addEventListener('change', (e) => {
    viewer2.loadModel(e.target.value);
});
