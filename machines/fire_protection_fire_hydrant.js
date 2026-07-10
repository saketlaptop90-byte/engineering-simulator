import { materials } from '../utils/materials.js';

export function createFireHydrant(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const redMat = (materials && materials.redPaint) || new THREE.MeshStandardMaterial({ color: 0xee0000, roughness: 0.4 });
    const silverMat = (materials && materials.silver) || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const brassMat = (materials && materials.brass) || new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.7 });

    // Base
    const baseGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
    const base = new THREE.Mesh(baseGeom, silverMat);
    base.position.set(0, 0.25, 0);
    group.add(base);

    // Body
    const bodyGeom = new THREE.CylinderGeometry(0.8, 1, 4, 32);
    const body = new THREE.Mesh(bodyGeom, redMat);
    body.position.set(0, 2.5, 0);
    group.add(body);

    // Top Dome
    const domeGeom = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeom, redMat);
    dome.position.set(0, 4.5, 0);
    group.add(dome);

    // Operating Nut
    const nutGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 5); // pentagon
    const nut = new THREE.Mesh(nutGeom, brassMat);
    nut.position.set(0, 5.5, 0);
    nut.name = "operatingNut";
    group.add(nut);

    // Nozzles / Caps
    const capGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    
    const cap1 = new THREE.Mesh(capGeom, silverMat);
    cap1.rotation.z = Math.PI / 2;
    cap1.position.set(0.9, 3, 0);
    cap1.name = "cap1";
    group.add(cap1);

    const cap2 = new THREE.Mesh(capGeom, silverMat);
    cap2.rotation.z = Math.PI / 2;
    cap2.position.set(-0.9, 3, 0);
    cap2.name = "cap2";
    group.add(cap2);

    const cap3 = new THREE.Mesh(capGeom, silverMat);
    cap3.rotation.x = Math.PI / 2;
    cap3.position.set(0, 3, 0.9);
    cap3.name = "cap3";
    group.add(cap3);

    // Animation: Nut turns, caps move out slightly to simulate removal
    const times = [0, 1, 2];
    
    const nutTrack = new THREE.QuaternionKeyframeTrack(
        `operatingNut.quaternion`,
        times,
        [
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 4, 0)).toArray(),
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 8, 0)).toArray()
        ]
    );

    const cap1Track = new THREE.VectorKeyframeTrack(
        `cap1.position`,
        times,
        [
            0.9, 3, 0,
            1.5, 3, 0,
            1.5, 2, 0 // falling off
        ]
    );

    const clip = new THREE.AnimationClip("Open", 2, [nutTrack, cap1Track]);
    animationClips.push(clip);

    return { group, animationClips };
}
