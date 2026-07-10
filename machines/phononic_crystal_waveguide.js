import { metalMaterial, glassMaterial, glowingMaterial, darkMaterial } from '../utils/materials.js';

export function createPhononicCrystalWaveguide(THREE) {
    const group = new THREE.Group();
    const mCrystal = glassMaterial || new THREE.MeshPhysicalMaterial({ color: 0xaaaaFF, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.2 });
    const mGlow = glowingMaterial || new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true });
    const mBase = darkMaterial || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 5), mBase);
    base.position.y = -0.25;
    group.add(base);

    const cylinders = [];
    for (let x = -4; x <= 4; x++) {
        for (let z = -2; z <= 2; z++) {
            // Create a defect line (waveguide path) at z = 0
            if (z === 0 && x > -3 && x < 3) continue;

            const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2, 16), mCrystal);
            cyl.position.set(x, 1, z);
            cyl.userData.baseY = 1;
            cylinders.push(cyl);
            group.add(cyl);
        }
    }

    const photonNode = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), mGlow);
    group.add(photonNode);

    group.userData.update = (delta, time) => {
        cylinders.forEach((cyl, i) => {
            const dist = Math.sqrt(cyl.position.x**2 + cyl.position.z**2);
            cyl.position.y = cyl.userData.baseY + Math.sin(time * 2 - dist) * 0.2;
        });
        
        // Guide acoustic wave through the defect channel
        photonNode.position.x = Math.sin(time) * 2.5;
        photonNode.position.z = Math.sin(time * 4) * 0.1;
        photonNode.position.y = 1;
        photonNode.scale.setScalar(1 + Math.sin(time * 10) * 0.2);
    };

    return { group, animationClips: [] };
}
