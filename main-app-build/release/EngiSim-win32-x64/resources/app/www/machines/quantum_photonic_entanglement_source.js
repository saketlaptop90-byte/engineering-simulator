import * as materialsModule from '../utils/materials.js';

export function createPhotonicEntanglementSource(THREE) {
    const materials = materialsModule.materials || materialsModule;
    const group = new THREE.Group();

    const matGold = materials.gold || new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.1 });
    const matGlass = materials.glass || new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 1, transparent: true });
    
    // Waveguide Chip
    const chipGeo = new THREE.BoxGeometry(3, 0.1, 2);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
    const chip = new THREE.Mesh(chipGeo, chipMat);
    group.add(chip);

    // Gold contacts
    const contactGeo = new THREE.BoxGeometry(0.2, 0.15, 0.2);
    const contact1 = new THREE.Mesh(contactGeo, matGold);
    contact1.position.set(-1.2, 0, -0.8);
    group.add(contact1);
    
    const contact2 = contact1.clone();
    contact2.position.set(-1.2, 0, 0.8);
    group.add(contact2);

    // Micro-ring resonator
    const ringGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 64);
    const ring = new THREE.Mesh(ringGeo, matGlass);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0.1, 0);
    ring.name = 'MicroRing';
    group.add(ring);

    // Pump Waveguide
    const guideGeo = new THREE.BoxGeometry(3, 0.05, 0.05);
    const guideMat = new THREE.MeshBasicMaterial({ color: 0x555555 });
    const waveguide = new THREE.Mesh(guideGeo, guideMat);
    waveguide.position.set(0, 0.1, -0.6);
    group.add(waveguide);

    // Photons
    const photonGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const photonRedMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const photonBlueMat = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    const photon1 = new THREE.Mesh(photonGeo, photonRedMat);
    photon1.name = 'Photon1';
    group.add(photon1);

    const photon2 = new THREE.Mesh(photonGeo, photonBlueMat);
    photon2.name = 'Photon2';
    group.add(photon2);

    // Animation
    const times = [0, 1, 2];
    const track1 = new THREE.VectorKeyframeTrack(
        'Photon1.position',
        times,
        [0, 0.1, 0,  1.5, 0.1, 0.5,  3, 0.1, 1]
    );

    const track2 = new THREE.VectorKeyframeTrack(
        'Photon2.position',
        times,
        [0, 0.1, 0,  1.5, 0.1, -0.5,  3, 0.1, -1]
    );

    const ringScale = new THREE.VectorKeyframeTrack(
        'MicroRing.scale',
        times,
        [1,1,1, 1.05,1.05,1.05, 1,1,1]
    );

    const clip = new THREE.AnimationClip('EntanglementGeneration', 2, [track1, track2, ringScale]);

    return { group, animationClips: [clip] };
}
