import * as materials from '../utils/materials.js';

export function createAnchorWinchMechanism(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 3);
    const base = new THREE.Mesh(baseGeo, materials.castIron);
    group.add(base);

    // Side supports
    const supportGeo = new THREE.BoxGeometry(0.5, 2.5, 2);
    const support1 = new THREE.Mesh(supportGeo, materials.castIron);
    support1.position.set(-1.5, 1.5, 0);
    group.add(support1);

    const support2 = new THREE.Mesh(supportGeo, materials.castIron);
    support2.position.set(1.5, 1.5, 0);
    group.add(support2);

    // Winch Drum
    const drumGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 32);
    drumGeo.rotateZ(Math.PI / 2);
    const drum = new THREE.Mesh(drumGeo, materials.steel);
    drum.position.y = 2;
    drum.name = "WinchDrum";
    group.add(drum);

    // Gypsy wheel (for chain)
    const gypsyGeo = new THREE.TorusGeometry(1, 0.2, 16, 16);
    gypsyGeo.rotateY(Math.PI / 2);
    const gypsy = new THREE.Mesh(gypsyGeo, materials.brass);
    gypsy.position.x = 1.2;
    drum.add(gypsy); // Attached to drum

    // Motor
    const motorGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 32);
    motorGeo.rotateZ(Math.PI / 2);
    const motor = new THREE.Mesh(motorGeo, materials.bluePaint || materials.steel);
    motor.position.set(-2.5, 2, 0);
    group.add(motor);

    // Anchor Chain (simplified)
    const chainGroup = new THREE.Group();
    chainGroup.name = "AnchorChain";
    group.add(chainGroup);

    const linkGeo = new THREE.TorusGeometry(0.15, 0.05, 8, 16);
    for (let i = 0; i < 20; i++) {
        const link = new THREE.Mesh(linkGeo, materials.darkSteel || materials.steel);
        link.position.set(1.2, 2 - (i * 0.25), 1);
        if (i % 2 === 0) {
            link.rotation.y = Math.PI / 2;
        }
        chainGroup.add(link);
    }

    // Animation: Winch pulling chain
    const times = [0, 4];
    
    // Drum rotating
    const xAxis = new THREE.Vector3(1, 0, 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI * 4);
    const drumTrack = new THREE.QuaternionKeyframeTrack(
        `WinchDrum.quaternion`,
        times,
        [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w]
    );

    // Chain moving up
    const chainTrack = new THREE.VectorKeyframeTrack(
        `AnchorChain.position`,
        times,
        [0, 0, 0, 0, 2, 0] // Moves up 2 units then resets
    );

    const clip = new THREE.AnimationClip('WinchOperate', 4, [drumTrack, chainTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
