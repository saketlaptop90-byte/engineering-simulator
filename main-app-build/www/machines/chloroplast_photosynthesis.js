import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';
import { createMachine as createChloroplast } from './chloroplast.js';

export function createMachine(THREE) {
    // Reusing the highly detailed chloroplast model with a distinct emphasis on the reaction
    const machine = createChloroplast(THREE);
    machine.description = "Chloroplast Photosynthesis: A microscopic view of the organelle that executes the light-dependent and light-independent (Calvin cycle) reactions to synthesize glucose from CO2 and water.";
    machine.group.scale.set(1.1, 1.1, 1.1);
    return machine;
}

// Auto-generated missing stub
export function createChloroplastPhotosynthesis() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
