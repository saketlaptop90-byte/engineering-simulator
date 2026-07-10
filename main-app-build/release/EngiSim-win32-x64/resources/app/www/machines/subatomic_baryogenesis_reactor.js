import { darkSteel, glass, copper, gold } from '../utils/materials.js';

export function createBaryogenesisReactor(THREE) {
    const group = new THREE.Group();
    group.name = "BaryogenesisReactor";

    const floor = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 1, 64), darkSteel);
    floor.position.y = 0.5;
    group.add(floor);

    const tank = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 8, 64), glass);
    tank.position.y = 5;
    group.add(tank);

    const antimatter = new THREE.Mesh(
        new THREE.SphereGeometry(2, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 })
    );
    antimatter.name = "Antimatter";
    antimatter.position.set(-2, 5, 0);
    group.add(antimatter);

    const matter = new THREE.Mesh(
        new THREE.SphereGeometry(2, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.8 })
    );
    matter.name = "Matter";
    matter.position.set(2, 5, 0);
    group.add(matter);

    const times = [0, 2, 4];
    const antiPos = [-2, 5, 0, -0.5, 5, 0, -2, 5, 0];
    const mattPos = [2, 5, 0, 0.5, 5, 0, 2, 5, 0];
    
    const antiTrack = new THREE.VectorKeyframeTrack('Antimatter.position', times, antiPos);
    const mattTrack = new THREE.VectorKeyframeTrack('Matter.position', times, mattPos);

    const clip = new THREE.AnimationClip('BaryogenesisCycle', 4, [antiTrack, mattTrack]);

    return { group, animationClips: [clip] };
}
