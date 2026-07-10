import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createDifferentialGear(THREE) {
    const group = new THREE.Group();
    
    // Cage Assembly
    const cage = new THREE.Group();
    cage.name = "Cage";
    const cageRing = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.6, 16, 64), darkSteel);
    cageRing.rotation.y = Math.PI / 2;
    cage.add(cageRing);
    
    const planetAxis = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 7, 16), darkSteel);
    planetAxis.rotation.z = Math.PI / 2;
    cage.add(planetAxis);
    
    // Planet gears (Brass)
    const planet1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.8, 0.6, 16), brass);
    planet1.name = "Planet1";
    planet1.position.set(2.4, 0, 0);
    planet1.rotation.z = -Math.PI / 2;
    cage.add(planet1);

    const planet2 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.8, 0.6, 16), brass);
    planet2.name = "Planet2";
    planet2.position.set(-2.4, 0, 0);
    planet2.rotation.z = Math.PI / 2;
    cage.add(planet2);
    
    group.add(cage);

    // Side gears (Aluminum)
    const sideGear1 = new THREE.Group();
    sideGear1.name = "SideGear1";
    const sg1Mesh = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.2, 0.6, 24), aluminum);
    sg1Mesh.position.set(0, 0.6, 0);
    const sg1Shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5, 16), darkSteel);
    sg1Shaft.position.set(0, 3, 0);
    sideGear1.add(sg1Mesh, sg1Shaft);
    sideGear1.position.set(0, 1.2, 0);
    group.add(sideGear1);

    const sideGear2 = new THREE.Group();
    sideGear2.name = "SideGear2";
    const sg2Mesh = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.2, 0.6, 24), aluminum);
    sg2Mesh.position.set(0, -0.6, 0);
    sg2Mesh.rotation.x = Math.PI; 
    const sg2Shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5, 16), darkSteel);
    sg2Shaft.position.set(0, -3, 0);
    sideGear2.add(sg2Mesh, sg2Shaft);
    sideGear2.position.set(0, -1.2, 0);
    group.add(sideGear2);

    const times = [0, 1, 2, 3, 4];
    const makeQArr = (axis, start, mult) => {
        const arr = [];
        for(let i=0; i<=4; i++){
            const angle = start + mult * (i/4)*Math.PI*2;
            const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
            arr.push(q.x, q.y, q.z, q.w);
        }
        return arr;
    };

    // Animation logic:
    // SideGear1 is stationary.
    // Cage rotates at speed 1.
    // SideGear2 rotates at speed 2.
    // Planets orbit with cage and rotate on their own axis at speed 2.
    const cageTrack = new THREE.QuaternionKeyframeTrack('Cage.quaternion', times, makeQArr(new THREE.Vector3(0,1,0), 0, 1));
    const sg2Track = new THREE.QuaternionKeyframeTrack('SideGear2.quaternion', times, makeQArr(new THREE.Vector3(0,1,0), 0, 2));
    const p1Track = new THREE.QuaternionKeyframeTrack('Planet1.quaternion', times, makeQArr(new THREE.Vector3(1,0,0), -Math.PI/2, 2));
    const p2Track = new THREE.QuaternionKeyframeTrack('Planet2.quaternion', times, makeQArr(new THREE.Vector3(1,0,0), Math.PI/2, -2));

    const clip = new THREE.AnimationClip('DifferentialOperation', 4, [cageTrack, sg2Track, p1Track, p2Track]);

    return { group, animationClips: [clip] };
}
