import { materials } from '../utils/materials.js';

export function createRoadGraderBladeMechanism(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matYellow = materials.yellowPaint || new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const matMetal = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333 });

    const circleBaseGeo = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const circleBase = new THREE.Mesh(circleBaseGeo, matYellow);
    circleBase.name = 'CircleBase';
    
    const bladeObj = new THREE.Object3D();
    bladeObj.name = 'BladePivot';
    bladeObj.position.set(0, -0.5, 0);

    const curvedBladeGeo = new THREE.CylinderGeometry(1, 1, 4, 16, 1, false, 0, Math.PI/3);
    const curvedBlade = new THREE.Mesh(curvedBladeGeo, matMetal);
    curvedBlade.rotation.z = Math.PI / 2;
    curvedBlade.rotation.x = -Math.PI / 6;
    bladeObj.add(curvedBlade);

    circleBase.add(bladeObj);
    group.add(circleBase);

    // Animations: Circle rotates, Blade tilts
    const times = [0, 2, 4, 6, 8];
    const qCircle0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qCircle1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0));
    const qCircle2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 4, 0));
    
    const tCircle = new THREE.QuaternionKeyframeTrack('CircleBase.quaternion', times, [
        ...qCircle0.toArray(), 
        ...qCircle1.toArray(), 
        ...qCircle0.toArray(), 
        ...qCircle2.toArray(), 
        ...qCircle0.toArray()
    ]);

    const qBlade0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qBlade1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 6, 0, 0));
    
    const tBlade = new THREE.QuaternionKeyframeTrack('BladePivot.quaternion', times, [
        ...qBlade0.toArray(),
        ...qBlade0.toArray(),
        ...qBlade1.toArray(),
        ...qBlade1.toArray(),
        ...qBlade0.toArray()
    ]);

    const clip = new THREE.AnimationClip('GradeMotion', 8, [tCircle, tBlade]);
    animationClips.push(clip);

    return { group, animationClips };
}
