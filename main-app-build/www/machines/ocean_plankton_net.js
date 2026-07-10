import { materials } from '../utils/materials.js';

export function createPlanktonNet(THREE) {
    const group = new THREE.Group();
    group.name = "PlanktonNetRoot";
    const animationClips = [];

    const netAssembly = new THREE.Group();
    netAssembly.name = "NetAssembly";
    group.add(netAssembly);

    const ringGeo = new THREE.TorusGeometry(1, 0.05, 16, 64);
    const ring = new THREE.Mesh(ringGeo, materials.metal || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    ring.rotation.x = Math.PI / 2;
    netAssembly.add(ring);

    const netGeo = new THREE.CylinderGeometry(1, 0.2, 3, 32, 1, true);
    const netMat = (materials.primary || new THREE.MeshBasicMaterial({color: 0xffffff})).clone();
    netMat.wireframe = true;
    netMat.transparent = true;
    netMat.opacity = 0.5;
    const net = new THREE.Mesh(netGeo, netMat);
    net.position.y = -1.5;
    net.name = "NetMesh";
    netAssembly.add(net);

    const codGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    const cod = new THREE.Mesh(codGeo, materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x222222}));
    cod.position.y = -3.25;
    netAssembly.add(cod);

    const towLine1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2), materials.metal || new THREE.MeshStandardMaterial({color: 0x888888}));
    towLine1.position.set(0, 0.8, 0.6);
    towLine1.rotation.x = -Math.PI / 4;
    netAssembly.add(towLine1);

    const towLine2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2), materials.metal || new THREE.MeshStandardMaterial({color: 0x888888}));
    towLine2.position.set(0, 0.8, -0.6);
    towLine2.rotation.x = Math.PI / 4;
    netAssembly.add(towLine2);

    // Animation
    const rotTrack = new THREE.QuaternionKeyframeTrack('NetAssembly.quaternion', 
        [0, 1, 2], 
        [...new THREE.Quaternion().toArray(), ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, 0, 0)).toArray(), ...new THREE.Quaternion().toArray()]
    );
    const scaleTrack = new THREE.VectorKeyframeTrack('NetMesh.scale', [0, 1, 2], [1, 1, 1, 1.05, 1, 1.05, 1, 1, 1]);

    animationClips.push(new THREE.AnimationClip('Tow', 2, [rotTrack, scaleTrack]));

    return { group, animationClips };
}
