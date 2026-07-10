import { materials } from '../utils/materials.js';

export function createMoltenSaltLoop(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const pipeMat = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.8, roughness: 0.3 });
    const saltMat = materials?.moltenSalt || new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 });
    
    const coreMat = saltMat.clone();
    const pipeSaltMat = saltMat.clone();

    // Reactor vessel
    const vessel = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3, 32), pipeMat);
    vessel.position.set(-3, 0, 0);
    group.add(vessel);

    // Heat exchanger
    const exchanger = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 2), pipeMat);
    exchanger.position.set(3, 0, 0);
    group.add(exchanger);

    // Loop pipes (Top and Bottom)
    const topPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 6, 16), pipeMat);
    topPipe.rotation.z = Math.PI / 2;
    topPipe.position.set(0, 1.5, 0);
    group.add(topPipe);

    const bottomPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 6, 16), pipeMat);
    bottomPipe.rotation.z = Math.PI / 2;
    bottomPipe.position.set(0, -1.5, 0);
    group.add(bottomPipe);

    // Inner glowing salt in the vessel
    const saltCore = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 2.9, 32), coreMat);
    saltCore.name = "saltCore";
    saltCore.position.set(-3, 0, 0);
    group.add(saltCore);

    // Inner glowing salt in the top pipe
    const topSalt = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 5.9, 16), pipeSaltMat);
    topSalt.name = "topSalt";
    topSalt.rotation.z = Math.PI / 2;
    topSalt.position.set(0, 1.5, 0);
    group.add(topSalt);

    // Animation: Pulse the salt to simulate heat/flow
    const times = [0, 1, 2];
    const opacityTrackCore = new THREE.NumberKeyframeTrack(`${saltCore.name}.material.opacity`, times, [0.4, 0.9, 0.4]);
    const opacityTrackTop = new THREE.NumberKeyframeTrack(`${topSalt.name}.material.opacity`, times, [0.9, 0.4, 0.9]);
    
    const clip = new THREE.AnimationClip('FluidFlow', 2, [opacityTrackCore, opacityTrackTop]);
    animationClips.push(clip);

    return { group, animationClips };
}
