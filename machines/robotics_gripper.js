import { materials } from '../utils/materials.js';

export function createRoboticGripper(THREE) {
    const group = new THREE.Group();
    
    const matBase = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.4 });
    const matFinger = materials?.accent || new THREE.MeshStandardMaterial({ color: 0x00aaff, metalness: 0.6, roughness: 0.3 });
    const matPad = materials?.rubber || new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0, roughness: 0.9 });
    
    // Gripper Base
    const baseGeo = new THREE.BoxGeometry(2, 1, 1);
    const base = new THREE.Mesh(baseGeo, matBase);
    group.add(base);

    // Connection rod
    const rodGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const rod = new THREE.Mesh(rodGeo, matBase);
    rod.position.y = 1;
    group.add(rod);

    const createFinger = (xOffset, invert = false) => {
        const fingerGroup = new THREE.Group();
        fingerGroup.position.set(xOffset, -0.5, 0);
        group.add(fingerGroup);

        const proximalGeo = new THREE.BoxGeometry(0.4, 1.5, 0.6);
        const proximal = new THREE.Mesh(proximalGeo, matFinger);
        proximal.position.y = -0.75;
        fingerGroup.add(proximal);

        const distalGroup = new THREE.Group();
        distalGroup.position.y = -1.5;
        fingerGroup.add(distalGroup);

        const distalGeo = new THREE.BoxGeometry(0.3, 1, 0.6);
        const distal = new THREE.Mesh(distalGeo, matFinger);
        distal.position.y = -0.5;
        distalGroup.add(distal);

        const padGeo = new THREE.BoxGeometry(0.1, 0.8, 0.5);
        const pad = new THREE.Mesh(padGeo, matPad);
        pad.position.set(invert ? 0.2 : -0.2, -0.5, 0);
        distalGroup.add(pad);

        return { fingerGroup, distalGroup };
    };

    const leftFinger = createFinger(-0.8, false);
    const rightFinger = createFinger(0.8, true);

    // Animations (Opening and Closing)
    const times = [0, 1, 2, 3];
    
    const qOpenL = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0.3).toArray();
    const qCloseL = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0).toArray();
    const qOpenDistalL = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -0.3).toArray();
    const qCloseDistalL = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0).toArray();

    const qOpenR = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -0.3).toArray();
    const qCloseR = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0).toArray();
    const qOpenDistalR = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0.3).toArray();
    const qCloseDistalR = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0).toArray();

    const lFingerTrack = new THREE.QuaternionKeyframeTrack(
        `${leftFinger.fingerGroup.uuid}.quaternion`, times, [...qCloseL, ...qOpenL, ...qOpenL, ...qCloseL]
    );
    const lDistalTrack = new THREE.QuaternionKeyframeTrack(
        `${leftFinger.distalGroup.uuid}.quaternion`, times, [...qCloseDistalL, ...qOpenDistalL, ...qOpenDistalL, ...qCloseDistalL]
    );

    const rFingerTrack = new THREE.QuaternionKeyframeTrack(
        `${rightFinger.fingerGroup.uuid}.quaternion`, times, [...qCloseR, ...qOpenR, ...qOpenR, ...qCloseR]
    );
    const rDistalTrack = new THREE.QuaternionKeyframeTrack(
        `${rightFinger.distalGroup.uuid}.quaternion`, times, [...qCloseDistalR, ...qOpenDistalR, ...qOpenDistalR, ...qCloseDistalR]
    );

    const animationClip = new THREE.AnimationClip('GripCycle', 3, [lFingerTrack, lDistalTrack, rFingerTrack, rDistalTrack]);

    return { group, animationClips: [animationClip] };
}
