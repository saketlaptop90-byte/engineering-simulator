import { materials } from '../utils/materials.js';

export function createShrinkWrapTunnel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials?.metal || new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.6, metalness: 0.3 });
    const matDark = materials?.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const matRoller = materials?.roller || new THREE.MeshStandardMaterial({ color: 0x777777 });

    // Main Conveyor Frame
    const frameGeo = new THREE.BoxGeometry(6, 0.5, 2);
    const frame = new THREE.Mesh(frameGeo, matMetal);
    frame.position.y = 0.25;
    group.add(frame);

    const rollerTracks = [];
    const numRollers = 15;
    const rollerGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.8, 16);

    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);

    for (let i = 0; i < numRollers; i++) {
        const pivot = new THREE.Group();
        pivot.position.set(-2.8 + i * 0.4, 0.6, 0);
        pivot.rotation.x = Math.PI / 2;
        group.add(pivot);

        const roller = new THREE.Mesh(rollerGeo, matRoller);
        roller.name = `Roller_${i}`;
        pivot.add(roller);

        const rTrack = new THREE.QuaternionKeyframeTrack(
            `Roller_${i}.quaternion`,
            [0, 0.5, 1],
            [
                q1.x, q1.y, q1.z, q1.w,
                q2.x, q2.y, q2.z, q2.w,
                q3.x, q3.y, q3.z, q3.w
            ]
        );
        rollerTracks.push(rTrack);
    }

    // Heat Tunnel Cover
    const tunnelGeo = new THREE.BoxGeometry(4, 2, 2.2);
    const tunnel = new THREE.Mesh(tunnelGeo, matMetal);
    tunnel.position.set(0, 1.6, 0);
    group.add(tunnel);

    const tunnelHoleGeo = new THREE.BoxGeometry(4.2, 1.5, 1.6);
    const tunnelHole = new THREE.Mesh(tunnelHoleGeo, matDark);
    tunnelHole.position.set(0, 1.3, 0);
    group.add(tunnelHole);

    // Control Box
    const controlGeo = new THREE.BoxGeometry(0.5, 0.8, 0.5);
    const control = new THREE.Mesh(controlGeo, matMetal);
    control.position.set(0, 2.6, 0.8);
    group.add(control);

    const clip = new THREE.AnimationClip('ConveyorRun', 1, rollerTracks);
    animationClips.push(clip);

    return { group, animationClips };
}
