import { metalMaterial, glassMaterial, laserMaterial } from '../utils/materials.js';

export function createQuantumEraser(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    // Base table
    const tableGeom = new THREE.BoxGeometry(12, 0.5, 8);
    const tableMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 });
    const table = new THREE.Mesh(tableGeom, tableMat);
    group.add(table);

    // Helper for mounting optical components
    function addMountedComponent(geom, mat, x, z, rotY = 0) {
        const compGroup = new THREE.Group();
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.y = 0.6;
        mesh.rotation.y = rotY;
        
        const postGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
        const postMat = metalMaterial || new THREE.MeshStandardMaterial({color: 0x555555});
        const post = new THREE.Mesh(postGeom, postMat);
        post.position.y = 0.3;
        
        const baseGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.1);
        const base = new THREE.Mesh(baseGeom, postMat);
        base.position.y = 0.05;

        compGroup.add(mesh);
        compGroup.add(post);
        compGroup.add(base);
        compGroup.position.set(x, 0.25, z);
        group.add(compGroup);
        return compGroup;
    }

    // Laser Source
    const laserMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0x111111 });
    addMountedComponent(new THREE.BoxGeometry(1, 0.4, 0.4), laserMat, -5, 0);

    // BBO Crystal (splits photon)
    const bboMat = glassMaterial || new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.9, opacity: 1, transparent: true });
    addMountedComponent(new THREE.BoxGeometry(0.2, 0.4, 0.4), bboMat, -3, 0);

    // Beam Splitters
    const bsMat = glassMaterial || new THREE.MeshPhysicalMaterial({ transmission: 0.5, transparent: true, opacity: 0.5, color: 0xaaffaa });
    addMountedComponent(new THREE.PlaneGeometry(0.5, 0.5), bsMat, 0, 2, Math.PI/4);
    addMountedComponent(new THREE.PlaneGeometry(0.5, 0.5), bsMat, 0, -2, Math.PI/4);

    // Mirrors
    const mirrorMat = metalMaterial || new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0 });
    addMountedComponent(new THREE.BoxGeometry(0.05, 0.5, 0.5), mirrorMat, -1, 2, Math.PI/4);
    addMountedComponent(new THREE.BoxGeometry(0.05, 0.5, 0.5), mirrorMat, -1, -2, -Math.PI/4);

    // Detectors
    const detMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0x882222 });
    addMountedComponent(new THREE.BoxGeometry(0.5, 0.5, 0.5), detMat, 3, 2);
    addMountedComponent(new THREE.BoxGeometry(0.5, 0.5, 0.5), detMat, 3, -2);
    addMountedComponent(new THREE.BoxGeometry(0.5, 0.5, 0.5), detMat, 4, 0);

    // Photon Animations
    const photonGeom = new THREE.SphereGeometry(0.05, 16, 16);
    const pMat1 = laserMaterial || new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const pMat2 = laserMaterial || new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.8 });

    const p1 = new THREE.Mesh(photonGeom, pMat1);
    group.add(p1);
    const p2 = new THREE.Mesh(photonGeom, pMat2);
    group.add(p2);

    // Animate photon splitting and traveling
    const t = [0, 1, 2, 3, 4];
    const track1 = new THREE.VectorKeyframeTrack(p1.uuid + '.position', t, [
        -5, 0.85, 0,   // start
        -3, 0.85, 0,   // BBO
        -1, 0.85, 2,   // mirror 1
         0, 0.85, 2,   // BS 1
         3, 0.85, 2    // Det 1
    ]);
    const track2 = new THREE.VectorKeyframeTrack(p2.uuid + '.position', t, [
        -5, 0.85, 0,   // start
        -3, 0.85, 0,   // BBO
        -1, 0.85, -2,  // mirror 2
         0, 0.85, -2,  // BS 2
         4, 0.85, 0    // Det 3
    ]);

    animationClips.push(new THREE.AnimationClip('photon_paths', 4, [track1, track2]));

    return { group, animationClips };
}
