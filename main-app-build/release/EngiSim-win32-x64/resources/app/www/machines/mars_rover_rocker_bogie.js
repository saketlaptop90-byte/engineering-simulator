import { aluminum, gold, blackPlastic, titanium } from '../utils/materials.js';

export function createRockerBogie(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const body = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 3), aluminum);
    group.add(body);

    function createSide(isLeft) {
        const sideGroup = new THREE.Group();
        const sign = isLeft ? 1 : -1;
        sideGroup.position.set(sign * 1.5, 0, 0);
        sideGroup.name = isLeft ? "leftSide" : "rightSide";

        const mainRocker = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), titanium);
        mainRocker.rotation.x = Math.PI / 4;
        sideGroup.add(mainRocker);

        const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
        wheelGeo.rotateZ(Math.PI / 2);

        const wheel1 = new THREE.Mesh(wheelGeo, blackPlastic);
        wheel1.position.set(0, -1, 1);
        wheel1.name = isLeft ? "wheel1L" : "wheel1R";
        sideGroup.add(wheel1);
        
        const wheel2 = new THREE.Mesh(wheelGeo, blackPlastic);
        wheel2.position.set(0, -1, -1);
        wheel2.name = isLeft ? "wheel2L" : "wheel2R";
        sideGroup.add(wheel2);

        const wheel3 = new THREE.Mesh(wheelGeo, blackPlastic);
        wheel3.position.set(0, -1.5, -2.5);
        wheel3.name = isLeft ? "wheel3L" : "wheel3R";
        sideGroup.add(wheel3);
        
        return sideGroup;
    }

    group.add(createSide(true), createSide(false));

    const times = [0, 2, 4];
    const leftVals = [1.5, 0, 0, 1.5, 0.5, 0, 1.5, 0, 0];
    const rightVals = [-1.5, 0, 0, -1.5, -0.5, 0, -1.5, 0, 0];
    const trackL = new THREE.VectorKeyframeTrack('leftSide.position', times, leftVals);
    const trackR = new THREE.VectorKeyframeTrack('rightSide.position', times, rightVals);
    
    const wTimes = [0, 1, 2, 3, 4];
    const wVals = [];
    for(let i=0; i<=4; i++) {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI * i);
        wVals.push(...q.toArray());
    }
    const tracks = [trackL, trackR];
    for (let w of ["wheel1L", "wheel2L", "wheel3L", "wheel1R", "wheel2R", "wheel3R"]) {
        tracks.push(new THREE.QuaternionKeyframeTrack(`${w}.quaternion`, wTimes, wVals));
    }

    const clip = new THREE.AnimationClip('Traverse', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
