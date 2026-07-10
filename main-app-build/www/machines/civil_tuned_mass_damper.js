import { concrete, darkSteel, aluminum } from '../utils/materials.js';

export function createTunedMassDamper(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Frame
    const frameGeo = new THREE.BoxGeometry(10, 20, 10);
    const frameEdges = new THREE.EdgesGeometry(frameGeo);
    const frame = new THREE.LineSegments(frameEdges, new THREE.LineBasicMaterial({ color: 0x333333 }));
    frame.position.set(0, 10, 0);

    const pendulumGroup = new THREE.Group();
    pendulumGroup.position.set(0, 20, 0);
    pendulumGroup.name = 'PendulumGroup';

    // Cables
    const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, 15);
    const offsets = [[-2, -2], [2, -2], [-2, 2], [2, 2]];
    for (let i = 0; i < 4; i++) {
        const cable = new THREE.Mesh(cableGeo, darkSteel);
        cable.position.set(offsets[i][0], -7.5, offsets[i][1]);
        pendulumGroup.add(cable);
    }

    // Mass
    const massGeo = new THREE.BoxGeometry(6, 6, 6);
    const mass = new THREE.Mesh(massGeo, concrete);
    mass.position.set(0, -15, 0);
    pendulumGroup.add(mass);

    // Dampers (hydraulic cylinders connecting mass to frame)
    const damperGeo = new THREE.CylinderGeometry(0.3, 0.3, 5);
    const damper1 = new THREE.Mesh(damperGeo, aluminum);
    damper1.position.set(0, -15, 3);
    damper1.rotation.x = Math.PI / 2;
    pendulumGroup.add(damper1);

    const damper2 = new THREE.Mesh(damperGeo, aluminum);
    damper2.position.set(0, -15, -3);
    damper2.rotation.x = Math.PI / 2;
    pendulumGroup.add(damper2);

    group.add(frame);
    group.add(pendulumGroup);

    // Animation: Pendulum swinging
    const times = [0, 2, 4, 6, 8];
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0.1));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q4 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.1, 0, -0.1));
    const q5 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    
    const values = [
        ...q1.toArray(),
        ...q2.toArray(),
        ...q3.toArray(),
        ...q4.toArray(),
        ...q5.toArray()
    ];

    const trackName = pendulumGroup.name + '.quaternion';
    const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('DamperSwing', 8, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
