import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';
import { createMachine as createChloroplast } from './chloroplast.js';

export function createMachine(THREE) {
    // Reusing the highly detailed chloroplast model with a distinct emphasis on structure
    const machine = createChloroplast(THREE);
    machine.description = "Chloroplast Structure: A detailed anatomical breakdown of the double membrane, stroma fluid, grana stacks, and thylakoid lumens that make up the cellular solar engine.";
    machine.group.scale.set(1.3, 1.3, 1.3);
    // Remove the photons to focus purely on the static structure
    machine.group.children = machine.group.children.filter(c => c.children.length !== 10);
    return machine;
}

// Auto-generated missing stub
export function createChloroplastStructure() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
