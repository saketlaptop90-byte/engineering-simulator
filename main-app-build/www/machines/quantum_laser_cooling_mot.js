import * as materialsModule from '../utils/materials.js';

export function createLaserCoolingMOT(THREE) {
    const materials = materialsModule.materials || materialsModule;
    const group = new THREE.Group();

    const matTitanium = materials.titanium || new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.2 });
    const matGlass = materials.glass || new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 1, transparent: true });

    // Vacuum Chamber (Spherical with viewports)
    const chamberGeo = new THREE.SphereGeometry(2, 32, 32);
    const chamber = new THREE.Mesh(chamberGeo, matTitanium);
    if(chamber.material) chamber.material = chamber.material.clone();
    chamber.material.transparent = true;
    chamber.material.opacity = 0.5;
    group.add(chamber);

    // Anti-Helmholtz Coils
    const coilGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 64);
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.7, roughness: 0.3 }); // Copper
    
    const coilTop = new THREE.Mesh(coilGeo, coilMat);
    coilTop.rotation.x = Math.PI / 2;
    coilTop.position.y = 1;
    group.add(coilTop);

    const coilBottom = new THREE.Mesh(coilGeo, coilMat);
    coilBottom.rotation.x = Math.PI / 2;
    coilBottom.position.y = -1;
    group.add(coilBottom);

    // 6 orthogonal cooling lasers
    const laserBeamGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 16);
    const laserBeamMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });

    const laserX = new THREE.Mesh(laserBeamGeo, laserBeamMat);
    laserX.rotation.z = Math.PI / 2;
    group.add(laserX);

    const laserY = new THREE.Mesh(laserBeamGeo, laserBeamMat);
    group.add(laserY);

    const laserZ = new THREE.Mesh(laserBeamGeo, laserBeamMat);
    laserZ.rotation.x = Math.PI / 2;
    group.add(laserZ);

    // Cloud of cold atoms
    const cloudGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffaaaa, transparent: true, opacity: 0.8 });
    const cloud = new THREE.Mesh(cloudGeo, cloudMat);
    cloud.name = 'AtomCloud';
    group.add(cloud);

    // Animation
    const times = [0, 1, 2, 3, 4];
    const cloudScale = new THREE.VectorKeyframeTrack(
        'AtomCloud.scale',
        times,
        [1,1,1, 0.8,0.8,0.8, 0.5,0.5,0.5, 0.8,0.8,0.8, 1,1,1] // Cloud compresses as it cools
    );

    const clip = new THREE.AnimationClip('LaserCooling', 4, [cloudScale]);

    return { group, animationClips: [clip] };
}
