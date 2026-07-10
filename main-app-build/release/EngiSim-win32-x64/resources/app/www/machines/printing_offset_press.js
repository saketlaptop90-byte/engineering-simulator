import { steel, aluminum, blackPlastic, rubber } from '../utils/materials.js';

export function createOffsetPress(THREE) {
    const group = new THREE.Group();
    group.name = "OffsetPress";
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(6, 1, 4);
    const base = new THREE.Mesh(baseGeo, steel);
    base.position.y = 0.5;
    group.add(base);

    const rollerGeo = new THREE.CylinderGeometry(0.5, 0.5, 3.5, 32);
    
    // Rollers
    const createRoller = (name, mat, xPos) => {
        const pivot = new THREE.Group();
        pivot.position.set(xPos, 2, 0);
        pivot.rotation.x = Math.PI / 2;
        group.add(pivot);

        const roller = new THREE.Mesh(rollerGeo, mat);
        roller.name = name;
        pivot.add(roller);
        return roller;
    };

    createRoller("plateRoller", aluminum, -1.5);
    createRoller("blanketRoller", rubber, 0);
    createRoller("impressionRoller", steel, 1.5);

    // Paper Plane
    const paperGroup = new THREE.Group();
    paperGroup.position.set(-3, 1.45, 0);
    paperGroup.name = "paperGroup";
    group.add(paperGroup);
    
    const paperGeo = new THREE.PlaneGeometry(2, 3);
    const paperMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.rotation.x = -Math.PI / 2;
    paperGroup.add(paper);

    // Animation
    const times = [0, 1, 2];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const valuesFwd = [ q0.x, q0.y, q0.z, q0.w, q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w ];

    const qInv1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI);
    const qInv2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI * 2);
    const valuesRev = [ q0.x, q0.y, q0.z, q0.w, qInv1.x, qInv1.y, qInv1.z, qInv1.w, qInv2.x, qInv2.y, qInv2.z, qInv2.w ];

    const track1 = new THREE.QuaternionKeyframeTrack('plateRoller.quaternion', times, valuesFwd);
    const track2 = new THREE.QuaternionKeyframeTrack('blanketRoller.quaternion', times, valuesRev);
    const track3 = new THREE.QuaternionKeyframeTrack('impressionRoller.quaternion', times, valuesFwd);

    const paperTimes = [0, 2];
    const paperPos = [-3, 1.45, 0, 3, 1.45, 0];
    const track4 = new THREE.VectorKeyframeTrack('paperGroup.position', paperTimes, paperPos);

    const clip = new THREE.AnimationClip('Operate', 2, [track1, track2, track3, track4]);
    animationClips.push(clip);

    return { group, animationClips };
}
