import { metalMaterial, glassMaterial, laserMaterial } from '../utils/materials.js';

export function createMachZehnderInterferometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Optical Breadboard
    const baseGeom = new THREE.BoxGeometry(10, 0.4, 10);
    const baseMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.6, roughness: 0.8 });
    const base = new THREE.Mesh(baseGeom, baseMat);
    group.add(base);

    // Component Mounter
    function addOptic(geom, mat, x, z, rotY) {
        const comp = new THREE.Group();
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.y = 0.8;
        mesh.rotation.y = rotY;
        
        const mountGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.8);
        const mountMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0x444444 });
        const mount = new THREE.Mesh(mountGeom, mountMat);
        mount.position.y = 0.4;
        
        comp.add(mesh);
        comp.add(mount);
        comp.position.set(x, 0.2, z);
        group.add(comp);
    }

    // Mirrors
    const mirrorGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const mirrorMat = metalMaterial || new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0 });
    // Rotated to stand up
    mirrorGeom.rotateX(Math.PI / 2);
    
    addOptic(mirrorGeom, mirrorMat, -3, -3, Math.PI / 4);
    addOptic(mirrorGeom, mirrorMat, 3, 3, Math.PI / 4);

    // Beam Splitters
    const bsGeom = new THREE.BoxGeometry(0.1, 1, 1);
    const bsMat = glassMaterial || new THREE.MeshPhysicalMaterial({ color: 0xddddff, transmission: 0.5, transparent: true, opacity: 0.5 });
    
    addOptic(bsGeom, bsMat, -3, 3, Math.PI / 4);
    addOptic(bsGeom, bsMat, 3, -3, Math.PI / 4);

    // Phase Shifter
    const psGeom = new THREE.BoxGeometry(0.5, 0.8, 0.5);
    const psMat = glassMaterial || new THREE.MeshPhysicalMaterial({ color: 0xffaa00, transmission: 0.8, transparent: true, opacity: 0.7 });
    addOptic(psGeom, psMat, 0, 3, 0);

    // Detectors
    const detGeom = new THREE.CylinderGeometry(0.4, 0.4, 1);
    detGeom.rotateX(Math.PI / 2);
    const detMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0x333333 });
    addOptic(detGeom, detMat, 3, -5, 0); // Det 1
    addOptic(detGeom, detMat, 5, -3, Math.PI / 2); // Det 2

    // Laser Source
    addOptic(new THREE.BoxGeometry(1.5, 0.6, 0.6), metalMaterial || new THREE.MeshStandardMaterial({ color: 0x111111 }), -5, 3, 0);

    // Photons
    const photonGeom = new THREE.SphereGeometry(0.1, 16, 16);
    const pMat1 = laserMaterial || new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const pMat2 = laserMaterial || new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const photon1 = new THREE.Mesh(photonGeom, pMat1);
    group.add(photon1);
    const photon2 = new THREE.Mesh(photonGeom, pMat2);
    group.add(photon2);

    // Paths
    const t = [0, 1, 2, 3, 4];
    // Path 1 (Upper arm): Source -> BS1 -> Mirror1 -> BS2 -> Det 1
    const track1 = new THREE.VectorKeyframeTrack(photon1.uuid + '.position', t, [
        -5, 1.0, 3,
        -3, 1.0, 3,
        -3, 1.0, -3,
         3, 1.0, -3,
         3, 1.0, -5
    ]);
    
    // Path 2 (Lower arm): Source -> BS1 -> Mirror2 -> BS2 -> Det 2
    const track2 = new THREE.VectorKeyframeTrack(photon2.uuid + '.position', t, [
        -5, 1.0, 3,
        -3, 1.0, 3,
         3, 1.0, 3,
         3, 1.0, -3,
         5, 1.0, -3
    ]);

    animationClips.push(new THREE.AnimationClip('interference', 4, [track1, track2]));

    return { group, animationClips };
}
