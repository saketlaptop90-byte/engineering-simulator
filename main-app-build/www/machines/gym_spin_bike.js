import { darkSteel, steel, rubber, plastic } from '../utils/materials.js';

export function createSpinBike(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Frame
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 1.2), darkSteel);
    base.position.set(0, 0.025, 0);
    group.add(base);

    const mainFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0), darkSteel);
    mainFrame.rotation.x = Math.PI / 4;
    mainFrame.position.set(0, 0.5, -0.1);
    group.add(mainFrame);

    const seatMast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8), darkSteel);
    seatMast.rotation.x = -Math.PI / 8;
    seatMast.position.set(0, 0.5, 0.3);
    group.add(seatMast);

    const frontMast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9), darkSteel);
    frontMast.rotation.x = -Math.PI / 16;
    frontMast.position.set(0, 0.6, -0.5);
    group.add(frontMast);

    // Flywheel (Front)
    const flywheel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 32), steel);
    flywheel.rotation.z = Math.PI / 2;
    flywheel.position.set(0, 0.3, -0.5);
    group.add(flywheel);

    // Seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.05, 0.25), rubber);
    seat.position.set(0, 0.9, 0.4);
    group.add(seat);

    // Handlebars
    const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5), rubber);
    handleBar.rotation.z = Math.PI / 2;
    handleBar.position.set(0, 1.0, -0.6);
    group.add(handleBar);

    // Pedals
    const crankCenter = new THREE.Group();
    crankCenter.position.set(0, 0.3, 0.1);
    group.add(crankCenter);

    const crankLeft = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.2, 0.04), steel);
    crankLeft.position.set(-0.1, 0.1, 0);
    crankCenter.add(crankLeft);

    const crankRight = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.2, 0.04), steel);
    crankRight.position.set(0.1, -0.1, 0);
    crankCenter.add(crankRight);

    // Animation: Pedals and Flywheel spinning
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray();
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI, 0, 0)).toArray();
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI*2, 0, 0)).toArray();

    const crankTrack = new THREE.QuaternionKeyframeTrack(
        `${crankCenter.uuid}.quaternion`,
        [0, 0.5, 1],
        [...q1, ...q2, ...q3]
    );

    const fwa1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/2)).toArray();
    const fwa2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI, 0, Math.PI/2)).toArray();
    const fwa3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI*2, 0, Math.PI/2)).toArray();
    const fwa4 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI*3, 0, Math.PI/2)).toArray();
    const fwa5 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI*4, 0, Math.PI/2)).toArray();

    const flywheelFastTrack = new THREE.QuaternionKeyframeTrack(
        `${flywheel.uuid}.quaternion`,
        [0, 0.25, 0.5, 0.75, 1],
        [...fwa1, ...fwa2, ...fwa3, ...fwa4, ...fwa5]
    );

    const clip = new THREE.AnimationClip('Spinning', 1, [crankTrack, flywheelFastTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
