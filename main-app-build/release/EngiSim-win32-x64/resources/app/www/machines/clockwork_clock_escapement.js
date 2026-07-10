import { brass, gold, wood, steel } from '../utils/materials.js';

export function createClockEscapement(THREE) {
    const group = new THREE.Group();

    // Stand
    const standGeo = new THREE.BoxGeometry(4, 1, 2);
    const stand = new THREE.Mesh(standGeo, wood);
    group.add(stand);

    const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 8);
    const pillar = new THREE.Mesh(pillarGeo, steel);
    pillar.position.y = 4;
    group.add(pillar);

    // Escape Wheel
    const wheelPivot = new THREE.Group();
    wheelPivot.position.set(0, 5, 0.5);
    wheelPivot.name = "WheelPivot";
    group.add(wheelPivot);

    const wheelGeo = new THREE.CylinderGeometry(2, 2, 0.2, 12);
    const wheel = new THREE.Mesh(wheelGeo, brass);
    wheel.rotation.x = Math.PI / 2;
    wheelPivot.add(wheel);

    // Add teeth to wheel
    for(let i=0; i<12; i++) {
        const toothGeo = new THREE.BoxGeometry(0.4, 0.6, 0.2);
        const tooth = new THREE.Mesh(toothGeo, brass);
        tooth.position.set(Math.cos(i*Math.PI/6)*2.1, Math.sin(i*Math.PI/6)*2.1, 0);
        tooth.rotation.z = i*Math.PI/6;
        wheel.add(tooth);
    }

    // Anchor (Pallet Fork)
    const anchorPivot = new THREE.Group();
    anchorPivot.position.set(0, 7, 0.5);
    anchorPivot.name = "AnchorPivot";
    group.add(anchorPivot);

    const anchorGeo = new THREE.TorusGeometry(1.5, 0.2, 8, 3, Math.PI);
    const anchor = new THREE.Mesh(anchorGeo, steel);
    anchor.rotation.z = Math.PI / 2;
    anchorPivot.add(anchor);

    // Pendulum attached to anchor
    const rodGeo = new THREE.CylinderGeometry(0.1, 0.1, 6);
    const rod = new THREE.Mesh(rodGeo, steel);
    rod.position.y = -3;
    anchorPivot.add(rod);

    const bobGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2);
    const bob = new THREE.Mesh(bobGeo, gold);
    bob.rotation.x = Math.PI / 2;
    bob.position.y = -6;
    anchorPivot.add(bob);

    // Animations
    const steps = 24;
    const duration = 2; // 2 seconds per full swing cycle
    const times = [];
    const anchorValues = [];
    const wheelValues = [];

    const maxSwing = Math.PI / 12; // 15 degrees

    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * duration;
        times.push(t);

        // Anchor swings back and forth like a sine wave
        const angle = Math.sin((t / duration) * Math.PI * 2) * maxSwing;
        const qa = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
        anchorValues.push(qa.x, qa.y, qa.z, qa.w);

        // Escape wheel rotates in steps, once per half swing
        const stepIndex = Math.floor((t / duration) * 2); 
        const wheelAngle = - (stepIndex * (Math.PI / 6)); // Rotate one tooth (30 deg) per tick
        const qw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), wheelAngle);
        wheelValues.push(qw.x, qw.y, qw.z, qw.w);
    }

    const anchorTrack = new THREE.QuaternionKeyframeTrack('AnchorPivot.quaternion', times, anchorValues);
    const wheelTrack = new THREE.QuaternionKeyframeTrack('WheelPivot.quaternion', times, wheelValues);

    const clip = new THREE.AnimationClip('tick_tock', duration, [anchorTrack, wheelTrack]);

    return { group, animationClips: [clip] };
}
