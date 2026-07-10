import { steel, redAccent, glass, yellowAccent } from '../utils/materials.js';

export function createBumperCar(THREE) {
    const group = new THREE.Group();
    group.name = 'BumperCarRide';

    // Arena Floor
    const floorGeo = new THREE.PlaneGeometry(40, 40);
    const floor = new THREE.Mesh(floorGeo, steel);
    floor.rotation.x = -Math.PI / 2;
    group.add(floor);

    // Ceiling Grid
    const ceilingGeo = new THREE.PlaneGeometry(40, 40);
    const ceiling = new THREE.Mesh(ceilingGeo, steel);
    ceiling.position.y = 10;
    ceiling.rotation.x = Math.PI / 2;
    group.add(ceiling);

    // Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.5, 0.5, 10);
    const positions = [
        [-20, -20], [20, -20], [-20, 20], [20, 20]
    ];
    positions.forEach(pos => {
        const pillar = new THREE.Mesh(pillarGeo, redAccent);
        pillar.position.set(pos[0], 5, pos[1]);
        group.add(pillar);
    });

    // Bumper Car Array
    const cars = [];
    const carGroup = new THREE.Group();
    group.add(carGroup);

    for (let i = 0; i < 4; i++) {
        const car = new THREE.Group();
        car.name = `bumperCar_${i}`;
        
        const bodyGeo = new THREE.BoxGeometry(3, 1, 4);
        const body = new THREE.Mesh(bodyGeo, i % 2 === 0 ? yellowAccent : redAccent);
        body.position.y = 0.5;
        car.add(body);

        const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 9.5);
        const pole = new THREE.Mesh(poleGeo, steel);
        pole.position.set(1, 5, -1);
        car.add(pole);

        const sparkGeo = new THREE.SphereGeometry(0.2);
        const spark = new THREE.Mesh(sparkGeo, glass);
        spark.position.set(1, 9.8, -1);
        car.add(spark);

        car.position.set(-10 + i * 6, 0, -10 + i * 5);
        carGroup.add(car);
        cars.push(car);
    }

    // Animation - cars driving around randomly but looping
    const tracks = [];
    
    // Simplistic paths
    const p1 = [ -10, 0, -10,  10, 0, -5,   5, 0, 10,  -10, 0, -10 ];
    const p2 = [ 10, 0, 10,   -5, 0, 15,  -15, 0, -5,   10, 0, 10 ];
    const p3 = [ -15, 0, 15,  15, 0, 5,   -5, 0, -15,  -15, 0, 15 ];
    const p4 = [ 5, 0, -15,   -15, 0, -5,  15, 0, 15,    5, 0, -15 ];
    
    const paths = [p1, p2, p3, p4];
    
    for (let i = 0; i < 4; i++) {
        const posTrack = new THREE.VectorKeyframeTrack(
            `bumperCar_${i}.position`,
            [0, 3, 6, 9],
            paths[i]
        );
        
        // Pseudo rotations
        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
        const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
        const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
        
        const rotTrack = new THREE.QuaternionKeyframeTrack(
            `bumperCar_${i}.quaternion`,
            [0, 3, 6, 9],
            [
                q1.x, q1.y, q1.z, q1.w,
                q2.x, q2.y, q2.z, q2.w,
                q3.x, q3.y, q3.z, q3.w,
                q1.x, q1.y, q1.z, q1.w
            ]
        );
        
        tracks.push(posTrack, rotTrack);
    }

    const clip = new THREE.AnimationClip('BumperCarDance', 9, tracks);

    return { group, animationClips: [clip] };
}
