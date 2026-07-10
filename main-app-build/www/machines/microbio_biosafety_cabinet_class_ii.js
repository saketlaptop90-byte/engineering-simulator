import * as materials from '../utils/materials.js';

export function createBiosafetyCabinetClassII(THREE) {
    const metal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const darkMetal = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.4 });
    const glass = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const glowingBlue = materials.glowingBlue || new THREE.MeshStandardMaterial({ color: 0x0055ff, emissive: 0x0055ff, emissiveIntensity: 2 });

    const group = new THREE.Group();
    group.name = "BiosafetyCabinetClassII";

    // Main Body
    const bodyGeo = new THREE.BoxGeometry(5, 6, 3);
    const body = new THREE.Mesh(bodyGeo, metal);
    body.position.y = 3;
    group.add(body);

    // Workspace Opening
    const workspaceGeo = new THREE.BoxGeometry(4.6, 2.5, 2.5);
    const workspace = new THREE.Mesh(workspaceGeo, darkMetal);
    workspace.position.set(0, 3, 0.25);
    group.add(workspace);

    // Glass Sash
    const sashGroup = new THREE.Group();
    sashGroup.position.set(0, 4.25, 1.5);
    sashGroup.name = "GlassSash";

    const sashGeo = new THREE.BoxGeometry(4.6, 2.5, 0.05);
    const sash = new THREE.Mesh(sashGeo, glass);
    sashGroup.add(sash);

    group.add(sashGroup);

    // Blower / Airflow indicator
    const airflowGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const airflow = new THREE.Mesh(airflowGeo, glowingBlue);
    airflow.position.set(0, 3, 0);
    airflow.name = "AirflowIndicator";
    group.add(airflow);

    // Animations: Sash sliding up/down, Airflow moving
    const times = [0, 2, 4];
    
    const sashValues = [
        0, 4.25, 1.5,
        0, 5.0, 1.5,
        0, 4.25, 1.5
    ];
    const sashTrack = new THREE.VectorKeyframeTrack(sashGroup.name + '.position', times, sashValues);

    const airflowValues = [
        0, 3, 0,
        0, 2, 0,
        0, 3, 0
    ];
    const airflowTrack = new THREE.VectorKeyframeTrack(airflow.name + '.position', times, airflowValues);

    const operateClip = new THREE.AnimationClip("OperateCabinet", 4, [sashTrack, airflowTrack]);

    return { group, animationClips: [operateClip] };
}
