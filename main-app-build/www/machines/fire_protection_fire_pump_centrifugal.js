import { materials } from '../utils/materials.js';

export function createFirePumpCentrifugal(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const redMat = (materials && materials.redPaint) || new THREE.MeshStandardMaterial({ color: 0xcc0000, metalness: 0.5, roughness: 0.5 });
    const metalMat = (materials && materials.steel) || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.4 });

    // Motor
    const motorGeom = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const motor = new THREE.Mesh(motorGeom, redMat);
    motor.rotation.z = Math.PI / 2;
    motor.position.set(-2, 0, 0);
    group.add(motor);

    // Pump Casing
    const pumpGeom = new THREE.TorusGeometry(1.5, 0.8, 16, 32);
    const pump = new THREE.Mesh(pumpGeom, redMat);
    pump.rotation.y = Math.PI / 2;
    pump.position.set(2, 0, 0);
    group.add(pump);

    // Shaft
    const shaftGeom = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const shaft = new THREE.Mesh(shaftGeom, metalMat);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(0, 0, 0);
    shaft.name = "shaft";
    group.add(shaft);

    // Flanges
    const flangeGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
    const flangeIn = new THREE.Mesh(flangeGeom, metalMat);
    flangeIn.position.set(2, 2.5, 0);
    group.add(flangeIn);

    const flangeOut = new THREE.Mesh(flangeGeom, metalMat);
    flangeOut.rotation.x = Math.PI / 2;
    flangeOut.position.set(2, 0, 2.5);
    group.add(flangeOut);

    // Animation: Shaft spinning
    const times = [0, 1];
    const shaftTrack = new THREE.QuaternionKeyframeTrack(
        `shaft.quaternion`,
        times,
        [
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/2)).toArray(),
            ...new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI * 2, 0, Math.PI/2)).toArray()
        ]
    );

    const clip = new THREE.AnimationClip("Spin", 1, [shaftTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
