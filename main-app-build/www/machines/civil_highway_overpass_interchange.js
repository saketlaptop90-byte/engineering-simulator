import { concrete, darkSteel, glass } from '../utils/materials.js';

export function createHighwayOverpassInterchange(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Structural Columns
    const colGeo = new THREE.CylinderGeometry(1.5, 1.5, 10, 16);
    const col1 = new THREE.Mesh(colGeo, concrete);
    col1.position.set(-8, 5, 0);
    group.add(col1);
    
    const col2 = new THREE.Mesh(colGeo, concrete);
    col2.position.set(8, 5, 0);
    group.add(col2);

    // Lower Highway
    const roadGeo = new THREE.BoxGeometry(40, 1, 12);
    const lowerRoad = new THREE.Mesh(roadGeo, concrete);
    lowerRoad.position.set(0, 0.5, 0);
    group.add(lowerRoad);

    // Upper Curved Overpass
    const curveGeo = new THREE.TorusGeometry(15, 3, 8, 32, Math.PI);
    const upperRoad = new THREE.Mesh(curveGeo, concrete);
    upperRoad.rotation.x = Math.PI / 2;
    upperRoad.position.set(0, 10, 0);
    group.add(upperRoad);

    // Guard Rails for Upper Road
    const railGeo = new THREE.TorusGeometry(15, 3.2, 8, 32, Math.PI);
    const upperRail = new THREE.Mesh(railGeo, darkSteel);
    upperRail.rotation.x = Math.PI / 2;
    upperRail.position.set(0, 10.2, 0);
    group.add(upperRail);

    // Traffic simulation
    const carGeo = new THREE.BoxGeometry(1.5, 1, 3);
    const car = new THREE.Mesh(carGeo, darkSteel);
    car.position.set(-15, 12, 0);
    car.name = "InterchangeCar";
    group.add(car);

    // Car navigating the overpass curve
    const times = [];
    const positions = [];
    const rotations = [];
    
    const steps = 30;
    for(let i = 0; i <= steps; i++) {
        let t = i / steps;
        times.push(t * 5); // 5 seconds duration
        
        let angle = Math.PI - (t * Math.PI);
        positions.push(Math.cos(angle)*15, 12, -Math.sin(angle)*15);
        
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        rotations.push(q.x, q.y, q.z, q.w);
    }
    
    const posTrack = new THREE.VectorKeyframeTrack(car.name + '.position', times, positions);
    const rotTrack = new THREE.QuaternionKeyframeTrack(car.name + '.quaternion', times, rotations);
    
    const clip = new THREE.AnimationClip('OverpassTraffic', 5, [posTrack, rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
