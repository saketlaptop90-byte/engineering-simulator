import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';
import { createMachine as createCantileverBridge } from './civil_cantilever_bridge.js';

export function createMachine(THREE) {
    // Reusing the civil_cantilever_bridge model but describing a single segment
    const machine = createCantileverBridge(THREE);
    machine.description = "Civil Cantilever Bridge Segment: Represents a single massive steel truss module or precast concrete box that is added symmetrically to the cantilever arm, allowing the bridge to be built outward in perfect balance without ground support.";
    machine.group.scale.set(1.2, 1.2, 1.2);
    // Remove the suspended span to focus on the cantilever arm
    if (machine.group.children[2]) {
        machine.group.remove(machine.group.children[2]);
    }
    return machine;
}

// Auto-generated missing stub
export function createCantileverBridgeSegment() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
