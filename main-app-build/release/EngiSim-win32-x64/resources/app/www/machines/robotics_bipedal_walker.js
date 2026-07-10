import { materials } from '../utils/materials.js';

export function createBipedalWalker(THREE) {
    const group = new THREE.Group();
    
    const matBody = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.3 });
    const matJoint = materials?.plastic || new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.1, roughness: 0.9 });
    const matFoot = materials?.rubber || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0, roughness: 1 });
    
    // Body (Pelvis)
    const pelvisGeo = new THREE.BoxGeometry(2, 0.5, 1);
    const pelvis = new THREE.Mesh(pelvisGeo, matBody);
    pelvis.position.y = 4;
    group.add(pelvis);

    const createLeg = (xOffset) => {
        const legGroup = new THREE.Group();
        legGroup.position.set(xOffset, 4, 0);
        group.add(legGroup);

        const thighGeo = new THREE.BoxGeometry(0.5, 2, 0.5);
        const thigh = new THREE.Mesh(thighGeo, matBody);
        thigh.position.y = -1;
        legGroup.add(thigh);

        const kneeGroup = new THREE.Group();
        kneeGroup.position.y = -2;
        legGroup.add(kneeGroup);

        const calfGeo = new THREE.BoxGeometry(0.4, 2, 0.4);
        const calf = new THREE.Mesh(calfGeo, matBody);
        calf.position.y = -1;
        kneeGroup.add(calf);

        const footGeo = new THREE.BoxGeometry(0.6, 0.2, 1.2);
        const foot = new THREE.Mesh(footGeo, matFoot);
        foot.position.set(0, -2.1, 0.2);
        kneeGroup.add(foot);

        return { legGroup, kneeGroup };
    };

    const leftLeg = createLeg(0.8);
    const rightLeg = createLeg(-0.8);

    const times = [0, 0.5, 1, 1.5, 2];
    
    // Left Leg Animation
    const lLegTrack = new THREE.QuaternionKeyframeTrack(
        `${leftLeg.legGroup.uuid}.quaternion`,
        times,
        [
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0.3).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -0.3).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0.3).toArray(),
        ]
    );

    const lKneeTrack = new THREE.QuaternionKeyframeTrack(
        `${leftLeg.kneeGroup.uuid}.quaternion`,
        times,
        [
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0.3).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0.1).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0).toArray(),
        ]
    );

    // Right Leg Animation (offset)
    const rLegTrack = new THREE.QuaternionKeyframeTrack(
        `${rightLeg.legGroup.uuid}.quaternion`,
        times,
        [
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -0.3).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0.3).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -0.3).toArray(),
        ]
    );

    const rKneeTrack = new THREE.QuaternionKeyframeTrack(
        `${rightLeg.kneeGroup.uuid}.quaternion`,
        times,
        [
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0.1).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0.3).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0).toArray(),
        ]
    );

    // Pelvis Bobbing
    const pelvisTrack = new THREE.VectorKeyframeTrack(
        `${pelvis.uuid}.position`,
        times,
        [
            0, 4, 0,
            0, 3.8, 0,
            0, 4, 0,
            0, 3.8, 0,
            0, 4, 0
        ]
    );

    const animationClip = new THREE.AnimationClip('WalkCycle', 2, [lLegTrack, lKneeTrack, rLegTrack, rKneeTrack, pelvisTrack]);

    return { group, animationClips: [animationClip] };
}
