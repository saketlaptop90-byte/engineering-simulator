import * as materialsModule from '../utils/materials.js';

export function createBariumIonTrap(THREE) {
    const materials = materialsModule.materials || materialsModule;
    const group = new THREE.Group();
    
    const matTitanium = materials.titanium || new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.2 });
    const matGold = materials.gold || new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.1 });
    const matGlass = materials.glass || new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 1, transparent: true });

    // Trap enclosure
    const enclosureGeo = new THREE.CylinderGeometry(2, 2, 4, 32, 1, true);
    const enclosure = new THREE.Mesh(enclosureGeo, matGlass);
    group.add(enclosure);

    // Electrodes
    const electrodeGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 16);
    for (let i = 0; i < 4; i++) {
        const electrode = new THREE.Mesh(electrodeGeo, matGold);
        electrode.position.x = Math.cos(i * Math.PI / 2) * 0.5;
        electrode.position.z = Math.sin(i * Math.PI / 2) * 0.5;
        group.add(electrode);
    }

    // Barium Ion (glowing sphere)
    const ionGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const ionMat = new THREE.MeshBasicMaterial({ color: 0x8a2be2 }); // Purple glow for Barium
    const ion = new THREE.Mesh(ionGeo, ionMat);
    ion.name = 'BariumIon';
    group.add(ion);

    // Laser cooling beams
    const laserGeo = new THREE.CylinderGeometry(0.02, 0.02, 4, 8);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
    
    const laserX = new THREE.Mesh(laserGeo, laserMat);
    laserX.rotation.z = Math.PI / 2;
    group.add(laserX);

    const laserY = new THREE.Mesh(laserGeo, laserMat);
    group.add(laserY);

    const laserZ = new THREE.Mesh(laserGeo, laserMat);
    laserZ.rotation.x = Math.PI / 2;
    group.add(laserZ);

    const animationClips = [];

    // Ion vibration animation
    const positionTrack = new THREE.VectorKeyframeTrack(
        'BariumIon.position',
        [0, 0.1, 0.2, 0.3, 0.4],
        [0,0,0, 0.05,0.05,0, -0.05,-0.05,0.05, 0,-0.05,-0.05, 0,0,0]
    );

    const clip = new THREE.AnimationClip('IonTrapActive', 0.4, [positionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
