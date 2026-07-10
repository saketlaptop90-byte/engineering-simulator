import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';
import { createMachine as createSprayDryer } from './chemical_spray_dryer.js';

export function createMachine(THREE) {
    // chemical_spray_drying_tower is functionally identical to chemical_spray_dryer
    // We will wrap the existing one but give it slightly larger scale to differentiate
    const machine = createSprayDryer(THREE);
    machine.description = "Chemical Spray Drying Tower: A massive, highly engineered vertical tower designed to flash-dry liquid slurries into ultra-fine powders using atomizers and hot gas streams.";
    machine.group.scale.set(1.2, 1.2, 1.2);
    return machine;
}

// Auto-generated missing stub
export function createSprayDryingTower() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
