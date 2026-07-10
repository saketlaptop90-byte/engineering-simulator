import { aluminum, gold, blackPlastic, titanium } from '../utils/materials.js';

export function createDescentStageCrane(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const stageBody = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 3), titanium);
    group.add(stageBody);

    for(let x of [-1.5, 1.5]) {
        for(let z of [-1.5, 1.5]) {
            const thruster = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.1, 0.4), blackPlastic);
            thruster.position.set(x, -0.45, z);
            group.add(thruster);
        }
    }

    const tetherGroup = new THREE.Group();
    tetherGroup.name = "tetherGroup";
    group.add(tetherGroup);

    const tetherGeo = new THREE.CylinderGeometry(0.02, 0.02, 1);
    tetherGeo.translate(0, -0.5, 0); 
    
    const tether1 = new THREE.Mesh(tetherGeo, gold);
    tether1.name = "tether1";
    tether1.position.set(-0.5, 0, 0);
    tetherGroup.add(tether1);

    const tether2 = new THREE.Mesh(tetherGeo, gold);
    tether2.name = "tether2";
    tether2.position.set(0.5, 0, 0);
    tetherGroup.add(tether2);

    const tether3 = new THREE.Mesh(tetherGeo, gold);
    tether3.name = "tether3";
    tether3.position.set(0, 0, 0.5);
    tetherGroup.add(tether3);

    const roverBody = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1.5), aluminum);
    roverBody.name = "roverPayload";
    tetherGroup.add(roverBody);

    const scaleTimes = [0, 4, 8];
    const scaleValues = [2, 5, 2]; 
    const sv = [];
    for(let s of scaleValues) sv.push(1, s, 1);
    
    const t1Track = new THREE.VectorKeyframeTrack('tether1.scale', scaleTimes, sv);
    const t2Track = new THREE.VectorKeyframeTrack('tether2.scale', scaleTimes, sv);
    const t3Track = new THREE.VectorKeyframeTrack('tether3.scale', scaleTimes, sv);

    const posValues = [];
    for(let s of scaleValues) posValues.push(0, -s, 0);
    const rTrack = new THREE.VectorKeyframeTrack('roverPayload.position', scaleTimes, posValues);

    const clip = new THREE.AnimationClip('SkyCrane', 8, [t1Track, t2Track, t3Track, rTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
