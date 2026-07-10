import * as THREE from 'three';
import {
    whitePlastic, steel, concrete, darkSteel, redAccent, glass
} from '../utils/materials.js';

export function createWindTurbine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base/Foundation
    const baseGeo = new THREE.CylinderGeometry(4, 4, 2, 32);
    const base = new THREE.Mesh(baseGeo, concrete);
    base.position.set(0, -1, 0);
    group.add(base);

    // Tower
    const towerGeo = new THREE.CylinderGeometry(1.5, 3, 50, 32);
    const tower = new THREE.Mesh(towerGeo, whitePlastic);
    tower.position.set(0, 25, 0);
    group.add(tower);

    // Nacelle
    const nacelleGeo = new THREE.BoxGeometry(4, 4, 10);
    const nacelle = new THREE.Mesh(nacelleGeo, whitePlastic);
    nacelle.position.set(0, 50, 2);
    group.add(nacelle);

    // Rotor Hub
    const hubGroup = new THREE.Group();
    hubGroup.position.set(0, 50, -3);
    group.add(hubGroup);

    const hubGeo = new THREE.SphereGeometry(2, 32, 32);
    const hub = new THREE.Mesh(hubGeo, whitePlastic);
    hub.scale.z = 1.5;
    hubGroup.add(hub);

    // Blades
    const bladeGeo = new THREE.BoxGeometry(1, 20, 0.5);
    // Taper the blade
    const positions = bladeGeo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i);
        if (y > 0) {
            positions.setX(i, positions.getX(i) * 0.3);
            positions.setZ(i, positions.getZ(i) * 0.1);
        }
    }
    bladeGeo.computeVertexNormals();

    for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(bladeGeo, whitePlastic);
        const pivot = new THREE.Group();
        pivot.rotation.z = (Math.PI * 2 / 3) * i;
        
        blade.position.y = 10;
        blade.rotation.y = Math.PI / 12; // Pitch angle
        
        pivot.add(blade);
        hubGroup.add(pivot);
    }

    // Anemometer on top
    const anemoGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    const anemometer = new THREE.Mesh(anemoGeo, darkSteel);
    anemometer.position.set(0, 53, 5);
    group.add(anemometer);

    group.userData.update = function(delta) {
        // Spin the rotor
        hubGroup.rotation.z -= delta * 1.5;
        
        // Slightly yaw to wind (simulate)
        const time = Date.now() * 0.0005;
        group.rotation.y = Math.sin(time) * 0.2;
    };

    return { group, animationClips };
}
