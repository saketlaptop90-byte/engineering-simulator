import { aluminum, carbonFiber, blackPlastic, yellowAccent } from '../utils/materials.js';

export function createBipedalMechanism(THREE) {
    const group = new THREE.Group();
    group.name = "BipedalMechanism";

    // Base pelvis
    const pelvisGeo = new THREE.BoxGeometry(2, 0.8, 1);
    const pelvis = new THREE.Mesh(pelvisGeo, carbonFiber);
    group.add(pelvis);

    // Joints and Limbs
    const createLeg = (namePrefix, xOffset) => {
        const pivot = new THREE.Group();
        pivot.position.set(xOffset, -0.4, 0);
        pivot.name = `${namePrefix}HipPivot`;

        const thighGeo = new THREE.CylinderGeometry(0.2, 0.2, 2);
        const thigh = new THREE.Mesh(thighGeo, aluminum);
        thigh.position.set(0, -1, 0);
        pivot.add(thigh);

        const kneePivot = new THREE.Group();
        kneePivot.position.set(0, -1, 0);
        kneePivot.name = `${namePrefix}KneePivot`;
        thigh.add(kneePivot);

        const calfGeo = new THREE.CylinderGeometry(0.15, 0.15, 2);
        const calf = new THREE.Mesh(calfGeo, blackPlastic);
        calf.position.set(0, -1, 0);
        kneePivot.add(calf);

        const footGeo = new THREE.BoxGeometry(0.5, 0.2, 1);
        const foot = new THREE.Mesh(footGeo, yellowAccent);
        foot.position.set(0, -1, 0.2);
        calf.add(foot);

        return pivot;
    };

    const leftLeg = createLeg('Left', -0.8);
    const rightLeg = createLeg('Right', 0.8);
    pelvis.add(leftLeg);
    pelvis.add(rightLeg);

    // Animations
    const walkDuration = 2;
    const qCenter = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qForward = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 6, 0, 0));
    const qBackward = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 6, 0, 0));
    const qKneeBent = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 4, 0, 0));

    const createTrack = (name, qs) => {
        const values = [];
        qs.forEach(q => values.push(...q.toArray()));
        return new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, [0, 0.5, 1, 1.5, 2], values);
    };

    const lHipTrack = createTrack('LeftHipPivot', [qCenter, qForward, qCenter, qBackward, qCenter]);
    const rHipTrack = createTrack('RightHipPivot', [qCenter, qBackward, qCenter, qForward, qCenter]);
    
    // Simple knee bending
    const lKneeTrack = createTrack('LeftKneePivot', [qCenter, qCenter, qKneeBent, qCenter, qCenter]);
    const rKneeTrack = createTrack('RightKneePivot', [qKneeBent, qCenter, qCenter, qCenter, qKneeBent]);

    const walkClip = new THREE.AnimationClip('Walk', walkDuration, [lHipTrack, rHipTrack, lKneeTrack, rKneeTrack]);

    return { group, animationClips: [walkClip] };
}
