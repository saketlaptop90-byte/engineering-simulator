// ============================================================================
// GOD TIER ALDERSON DISK — Hypothetical Stellar Megastructure
// A colossal flat disk with a central star hole, extending to ~1 AU radius.
// Features: terrain, cities, rim walls, atmosphere retention, day/night cycle,
// orbital elevators, transit systems, stellar collectors, and more.
// ============================================================================

import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = 'AldersonDisk_UltraGodTier';

    // ========================================================================
    // CUSTOM MATERIALS — Hyper-Realistic & Emissive
    // ========================================================================
    const starCoreMat = new THREE.MeshStandardMaterial({
        color: 0xfff8e0,
        emissive: 0xffcc00,
        emissiveIntensity: 3.5,
        roughness: 0.1,
        metalness: 0.0,
        transparent: true,
        opacity: 0.95
    });

    const starCoronaMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff8800,
        emissiveIntensity: 2.8,
        roughness: 0.0,
        metalness: 0.0,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
    });

    const starGlowMat = new THREE.MeshStandardMaterial({
        color: 0xffdd44,
        emissive: 0xffcc22,
        emissiveIntensity: 1.8,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide
    });

    const diskSurfaceTopMat = new THREE.MeshStandardMaterial({
        color: 0x3a6b35,
        roughness: 0.85,
        metalness: 0.05,
        flatShading: false
    });

    const diskSurfaceBottomMat = new THREE.MeshStandardMaterial({
        color: 0x2a4a28,
        roughness: 0.9,
        metalness: 0.05,
        flatShading: false
    });

    const diskSubstrateMat = new THREE.MeshStandardMaterial({
        color: 0x555566,
        roughness: 0.4,
        metalness: 0.85
    });

    const rimWallMat = new THREE.MeshStandardMaterial({
        color: 0x778899,
        roughness: 0.3,
        metalness: 0.92,
        emissive: 0x112233,
        emissiveIntensity: 0.15
    });

    const rimLightMat = new THREE.MeshStandardMaterial({
        color: 0x00ccff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.8
    });

    const oceanMat = new THREE.MeshStandardMaterial({
        color: 0x1a5276,
        roughness: 0.15,
        metalness: 0.3,
        transparent: true,
        opacity: 0.7
    });

    const cityLightMat = new THREE.MeshStandardMaterial({
        color: 0xffffaa,
        emissive: 0xffee66,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9
    });

    const cityBuildingMat = new THREE.MeshStandardMaterial({
        color: 0xaabbcc,
        roughness: 0.35,
        metalness: 0.7
    });

    const megaCityNeonMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00cc,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.85
    });

    const transitTubeMat = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        emissive: 0x4488ff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.5
    });

    const elevatorCableMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.2,
        metalness: 0.95,
        emissive: 0x223344,
        emissiveIntensity: 0.3
    });

    const solarCollectorMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a3a,
        roughness: 0.1,
        metalness: 0.95,
        emissive: 0x0022aa,
        emissiveIntensity: 0.6
    });

    const atmosphereShieldMat = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        emissive: 0x4499ee,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide
    });

    const terrainHighlandMat = new THREE.MeshStandardMaterial({
        color: 0x8B7355,
        roughness: 0.95,
        metalness: 0.05,
        flatShading: true
    });

    const terrainDesertMat = new THREE.MeshStandardMaterial({
        color: 0xD2B48C,
        roughness: 0.9,
        metalness: 0.02
    });

    const terrainIceMat = new THREE.MeshStandardMaterial({
        color: 0xE0F0FF,
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85
    });

    const gravitySinkMat = new THREE.MeshStandardMaterial({
        color: 0x220044,
        emissive: 0x6600cc,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.6
    });

    const terminatorLineMat = new THREE.MeshStandardMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });

    const spaceportMat = new THREE.MeshStandardMaterial({
        color: 0x556677,
        roughness: 0.25,
        metalness: 0.88,
        emissive: 0x0044aa,
        emissiveIntensity: 0.5
    });

    const dockingRingMat = new THREE.MeshStandardMaterial({
        color: 0x99aacc,
        roughness: 0.2,
        metalness: 0.9,
        emissive: 0x2244ff,
        emissiveIntensity: 0.8
    });

    // ========================================================================
    // SECTION 1: THE CENTRAL STAR (Multi-layered, pulsing, with corona)
    // ========================================================================
    const starGroup = new THREE.Group();
    starGroup.name = 'CentralStar';

    // Star core — dense, blindingly bright
    const starCoreGeo = new THREE.SphereGeometry(2.8, 64, 64);
    const starCore = new THREE.Mesh(starCoreGeo, starCoreMat);
    starCore.name = 'StarCore';
    starGroup.add(starCore);

    // Inner chromosphere shell
    const chromosphereGeo = new THREE.SphereGeometry(3.2, 48, 48);
    const chromosphere = new THREE.Mesh(chromosphereGeo, starCoronaMat.clone());
    chromosphere.material.opacity = 0.5;
    chromosphere.name = 'Chromosphere';
    starGroup.add(chromosphere);

    // Outer corona layer 1
    const corona1Geo = new THREE.SphereGeometry(4.0, 40, 40);
    const corona1 = new THREE.Mesh(corona1Geo, starCoronaMat);
    corona1.name = 'Corona_Layer1';
    starGroup.add(corona1);

    // Outer corona layer 2 — very faint
    const corona2Geo = new THREE.SphereGeometry(5.2, 32, 32);
    const corona2 = new THREE.Mesh(corona2Geo, starGlowMat);
    corona2.name = 'Corona_Layer2';
    starGroup.add(corona2);

    // Solar prominences — extruded arcs around the star
    const prominenceCount = 12;
    for (let i = 0; i < prominenceCount; i++) {
        const angle = (i / prominenceCount) * Math.PI * 2;
        const promCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle) * 3.0, -0.5, Math.sin(angle) * 3.0),
            new THREE.Vector3(Math.cos(angle) * 4.5, 1.5 + Math.random() * 1.5, Math.sin(angle) * 4.5),
            new THREE.Vector3(Math.cos(angle + 0.3) * 3.8, 2.5 + Math.random(), Math.sin(angle + 0.3) * 3.8),
            new THREE.Vector3(Math.cos(angle + 0.5) * 3.0, 0.0, Math.sin(angle + 0.5) * 3.0)
        ]);
        const promGeo = new THREE.TubeGeometry(promCurve, 20, 0.08 + Math.random() * 0.06, 8, false);
        const promMat = starCoronaMat.clone();
        promMat.emissiveIntensity = 1.5 + Math.random() * 1.5;
        promMat.opacity = 0.4 + Math.random() * 0.3;
        const prominence = new THREE.Mesh(promGeo, promMat);
        prominence.name = `SolarProminence_${i}`;
        starGroup.add(prominence);
    }

    // Sunspot patches on core surface
    for (let i = 0; i < 8; i++) {
        const phi = Math.random() * Math.PI;
        const theta = Math.random() * Math.PI * 2;
        const spotGeo = new THREE.CircleGeometry(0.15 + Math.random() * 0.2, 16);
        const spotMat = new THREE.MeshStandardMaterial({
            color: 0x993300,
            emissive: 0x661100,
            emissiveIntensity: 0.8
        });
        const spot = new THREE.Mesh(spotGeo, spotMat);
        spot.position.set(
            2.82 * Math.sin(phi) * Math.cos(theta),
            2.82 * Math.cos(phi),
            2.82 * Math.sin(phi) * Math.sin(theta)
        );
        spot.lookAt(0, 0, 0);
        spot.name = `Sunspot_${i}`;
        starGroup.add(spot);
    }

    // Point light emanating from the star
    const starLight = new THREE.PointLight(0xfff4e0, 3.0, 100, 1.5);
    starLight.position.set(0, 0, 0);
    starGroup.add(starLight);

    // Secondary fill light
    const fillLight = new THREE.PointLight(0xffcc88, 1.0, 60, 2.0);
    fillLight.position.set(0, 5, 0);
    starGroup.add(fillLight);

    starGroup.position.set(0, 0, 0);
    group.add(starGroup);

    // ========================================================================
    // SECTION 2: THE DISK — Massive annular structure with terrain detail
    // ========================================================================
    const diskGroup = new THREE.Group();
    diskGroup.name = 'AldersonDiskBody';

    // Main disk body — annular ring (inner hole for star, outer edge at ~1AU scale)
    const diskInnerRadius = 6.0;
    const diskOuterRadius = 28.0;
    const diskThickness = 0.35;

    // Top surface of the disk (habitable side A)
    const diskTopShape = new THREE.Shape();
    diskTopShape.absarc(0, 0, diskOuterRadius, 0, Math.PI * 2, false);
    const diskHole = new THREE.Path();
    diskHole.absarc(0, 0, diskInnerRadius, 0, Math.PI * 2, true);
    diskTopShape.holes.push(diskHole);
    const diskTopGeo = new THREE.ShapeGeometry(diskTopShape, 128);
    const diskTop = new THREE.Mesh(diskTopGeo, diskSurfaceTopMat);
    diskTop.rotation.x = -Math.PI / 2;
    diskTop.position.y = diskThickness / 2;
    diskTop.name = 'DiskSurface_Top';
    diskGroup.add(diskTop);

    // Bottom surface of the disk (habitable side B)
    const diskBottomGeo = new THREE.ShapeGeometry(diskTopShape, 128);
    const diskBottom = new THREE.Mesh(diskBottomGeo, diskSurfaceBottomMat);
    diskBottom.rotation.x = Math.PI / 2;
    diskBottom.position.y = -diskThickness / 2;
    diskBottom.name = 'DiskSurface_Bottom';
    diskGroup.add(diskBottom);

    // Disk structural substrate (edge ring visible from the side)
    const diskEdgeGeo = new THREE.CylinderGeometry(diskOuterRadius, diskOuterRadius, diskThickness, 256, 1, true);
    const diskEdge = new THREE.Mesh(diskEdgeGeo, diskSubstrateMat);
    diskEdge.name = 'DiskEdge_Outer';
    diskGroup.add(diskEdge);

    // Inner edge (around the star hole)
    const diskInnerEdgeGeo = new THREE.CylinderGeometry(diskInnerRadius, diskInnerRadius, diskThickness + 0.1, 128, 1, true);
    const diskInnerEdge = new THREE.Mesh(diskInnerEdgeGeo, chrome);
    diskInnerEdge.name = 'DiskEdge_Inner_StarInterface';
    diskGroup.add(diskInnerEdge);

    // Inner thermal shield ring — protects disk from stellar radiation
    const thermalShieldGeo = new THREE.TorusGeometry(diskInnerRadius + 0.2, 0.15, 16, 128);
    const thermalShieldMat = new THREE.MeshStandardMaterial({
        color: 0xdd4400,
        emissive: 0xcc3300,
        emissiveIntensity: 1.2,
        roughness: 0.3,
        metalness: 0.8
    });
    const thermalShield = new THREE.Mesh(thermalShieldGeo, thermalShieldMat);
    thermalShield.rotation.x = Math.PI / 2;
    thermalShield.name = 'ThermalShieldRing';
    diskGroup.add(thermalShield);

    // ========================================================================
    // SECTION 3: TERRAIN BIOMES — Oceans, deserts, highlands, ice caps
    // ========================================================================
    const terrainGroup = new THREE.Group();
    terrainGroup.name = 'TerrainBiomes';

    // Generate ocean sectors (annular wedges on the top surface)
    const oceanSectors = 8;
    for (let i = 0; i < oceanSectors; i++) {
        const startAngle = (i / oceanSectors) * Math.PI * 2 + 0.1;
        const endAngle = startAngle + (Math.PI * 2 / oceanSectors) * 0.4;
        const innerR = diskInnerRadius + 2 + Math.random() * 4;
        const outerR = innerR + 3 + Math.random() * 5;
        const oceanShape = new THREE.Shape();
        oceanShape.absarc(0, 0, Math.min(outerR, diskOuterRadius - 2), startAngle, endAngle, false);
        oceanShape.absarc(0, 0, innerR, endAngle, startAngle, true);
        const oceanGeo = new THREE.ShapeGeometry(oceanShape, 32);
        const ocean = new THREE.Mesh(oceanGeo, oceanMat);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.y = diskThickness / 2 + 0.02;
        ocean.name = `Ocean_Sector_${i}`;
        terrainGroup.add(ocean);
    }

    // Generate desert patches
    for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = diskInnerRadius + 3 + Math.random() * (diskOuterRadius - diskInnerRadius - 6);
        const desertGeo = new THREE.CircleGeometry(1.0 + Math.random() * 2.0, 24);
        const desert = new THREE.Mesh(desertGeo, terrainDesertMat);
        desert.rotation.x = -Math.PI / 2;
        desert.position.set(
            Math.cos(angle) * radius,
            diskThickness / 2 + 0.025,
            Math.sin(angle) * radius
        );
        desert.name = `Desert_Patch_${i}`;
        terrainGroup.add(desert);
    }

    // Generate highland mountain ranges using LatheGeometry
    for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = diskInnerRadius + 4 + Math.random() * (diskOuterRadius - diskInnerRadius - 8);
        const mountainPts = [];
        mountainPts.push(new THREE.Vector2(0, 0));
        mountainPts.push(new THREE.Vector2(0.6, 0));
        mountainPts.push(new THREE.Vector2(0.5, 0.15));
        mountainPts.push(new THREE.Vector2(0.35, 0.35 + Math.random() * 0.25));
        mountainPts.push(new THREE.Vector2(0.15, 0.5 + Math.random() * 0.3));
        mountainPts.push(new THREE.Vector2(0, 0.6 + Math.random() * 0.2));
        const mountainGeo = new THREE.LatheGeometry(mountainPts, 12);
        const mountain = new THREE.Mesh(mountainGeo, terrainHighlandMat);
        mountain.position.set(
            Math.cos(angle) * radius,
            diskThickness / 2,
            Math.sin(angle) * radius
        );
        mountain.scale.set(0.6 + Math.random() * 0.5, 0.4 + Math.random() * 0.6, 0.6 + Math.random() * 0.5);
        mountain.name = `Mountain_Range_${i}`;
        terrainGroup.add(mountain);
    }

    // Ice caps near the outer rim (colder region)
    for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = diskOuterRadius - 2 - Math.random() * 3;
        const iceGeo = new THREE.CircleGeometry(1.5 + Math.random() * 1.5, 20);
        const ice = new THREE.Mesh(iceGeo, terrainIceMat);
        ice.rotation.x = -Math.PI / 2;
        ice.position.set(
            Math.cos(angle) * radius,
            diskThickness / 2 + 0.03,
            Math.sin(angle) * radius
        );
        ice.name = `IceCap_${i}`;
        terrainGroup.add(ice);
    }

    diskGroup.add(terrainGroup);

    // ========================================================================
    // SECTION 4: MEGA-CITIES & Urban Infrastructure
    // ========================================================================
    const citiesGroup = new THREE.Group();
    citiesGroup.name = 'MegaCities';

    // Generate major city clusters
    const cityCount = 16;
    for (let c = 0; c < cityCount; c++) {
        const cityCluster = new THREE.Group();
        const angle = (c / cityCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const radius = diskInnerRadius + 3 + Math.random() * (diskOuterRadius - diskInnerRadius - 7);
        const cx = Math.cos(angle) * radius;
        const cz = Math.sin(angle) * radius;

        // City base platform
        const baseGeo = new THREE.CylinderGeometry(0.8 + Math.random() * 0.5, 1.0 + Math.random() * 0.5, 0.05, 24);
        const baseMesh = new THREE.Mesh(baseGeo, steel);
        cityCluster.add(baseMesh);

        // Skyscrapers of varying heights
        const buildingCount = 8 + Math.floor(Math.random() * 12);
        for (let b = 0; b < buildingCount; b++) {
            const bx = (Math.random() - 0.5) * 1.2;
            const bz = (Math.random() - 0.5) * 1.2;
            const bHeight = 0.1 + Math.random() * 0.6;
            const bWidth = 0.03 + Math.random() * 0.06;

            // Building body
            const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bWidth);
            const bMesh = new THREE.Mesh(bGeo, cityBuildingMat);
            bMesh.position.set(bx, bHeight / 2 + 0.025, bz);
            cityCluster.add(bMesh);

            // Glowing windows
            const winGeo = new THREE.BoxGeometry(bWidth + 0.005, bHeight * 0.9, bWidth + 0.005);
            const winMesh = new THREE.Mesh(winGeo, cityLightMat);
            winMesh.position.set(bx, bHeight / 2 + 0.025, bz);
            cityCluster.add(winMesh);

            // Rooftop beacon
            if (Math.random() > 0.5) {
                const beaconGeo = new THREE.SphereGeometry(0.01, 8, 8);
                const beaconMat = new THREE.MeshStandardMaterial({
                    color: 0xff0000,
                    emissive: 0xff0000,
                    emissiveIntensity: 3.0
                });
                const beacon = new THREE.Mesh(beaconGeo, beaconMat);
                beacon.position.set(bx, bHeight + 0.035, bz);
                cityCluster.add(beacon);
            }
        }

        // Central mega-tower (arcology)
        const towerPts = [];
        towerPts.push(new THREE.Vector2(0.12, 0));
        towerPts.push(new THREE.Vector2(0.12, 0.3));
        towerPts.push(new THREE.Vector2(0.10, 0.5));
        towerPts.push(new THREE.Vector2(0.08, 0.7));
        towerPts.push(new THREE.Vector2(0.05, 0.9));
        towerPts.push(new THREE.Vector2(0.02, 1.0));
        towerPts.push(new THREE.Vector2(0.0, 1.05));
        const towerGeo = new THREE.LatheGeometry(towerPts, 16);
        const towerMesh = new THREE.Mesh(towerGeo, chrome);
        towerMesh.position.y = 0.025;
        cityCluster.add(towerMesh);

        // Neon ring at tower mid-section
        const neonRingGeo = new THREE.TorusGeometry(0.09, 0.008, 8, 32);
        const neonRing = new THREE.Mesh(neonRingGeo, megaCityNeonMat);
        neonRing.position.y = 0.55;
        neonRing.rotation.x = Math.PI / 2;
        cityCluster.add(neonRing);

        cityCluster.position.set(cx, diskThickness / 2, cz);
        cityCluster.name = `MegaCity_${c}`;
        citiesGroup.add(cityCluster);
    }

    diskGroup.add(citiesGroup);

    // ========================================================================
    // SECTION 5: RIM WALLS — Massive atmosphere retention barriers
    // ========================================================================
    const rimGroup = new THREE.Group();
    rimGroup.name = 'RimWalls';

    const rimWallHeight = 2.5;
    const rimSegments = 256;

    // Outer rim wall
    const outerRimGeo = new THREE.CylinderGeometry(
        diskOuterRadius + 0.1, diskOuterRadius + 0.1,
        rimWallHeight, rimSegments, 4, true
    );
    const outerRim = new THREE.Mesh(outerRimGeo, rimWallMat);
    outerRim.position.y = rimWallHeight / 2;
    outerRim.name = 'OuterRimWall';
    rimGroup.add(outerRim);

    // Outer rim reinforcement buttresses
    const buttressCount = 64;
    for (let i = 0; i < buttressCount; i++) {
        const angle = (i / buttressCount) * Math.PI * 2;
        const buttGeo = new THREE.BoxGeometry(0.08, rimWallHeight * 0.8, 0.5);
        const buttress = new THREE.Mesh(buttGeo, darkSteel);
        buttress.position.set(
            Math.cos(angle) * (diskOuterRadius + 0.3),
            rimWallHeight * 0.4,
            Math.sin(angle) * (diskOuterRadius + 0.3)
        );
        buttress.rotation.y = -angle;
        buttress.name = `Buttress_${i}`;
        rimGroup.add(buttress);
    }

    // Rim wall illumination strips (neon lights along the rim top)
    const rimLightRingGeo = new THREE.TorusGeometry(diskOuterRadius + 0.05, 0.04, 8, 256);
    const rimLightRing = new THREE.Mesh(rimLightRingGeo, rimLightMat);
    rimLightRing.position.y = rimWallHeight;
    rimLightRing.rotation.x = Math.PI / 2;
    rimLightRing.name = 'RimLightRing_Top';
    rimGroup.add(rimLightRing);

    // Secondary light ring at mid-height
    const rimLightMid = new THREE.Mesh(
        new THREE.TorusGeometry(diskOuterRadius + 0.05, 0.025, 8, 256),
        rimLightMat.clone()
    );
    rimLightMid.material.emissiveIntensity = 1.5;
    rimLightMid.position.y = rimWallHeight * 0.5;
    rimLightMid.rotation.x = Math.PI / 2;
    rimLightMid.name = 'RimLightRing_Mid';
    rimGroup.add(rimLightMid);

    // Inner rim wall (around the star hole — heat-resistant)
    const innerRimGeo = new THREE.CylinderGeometry(
        diskInnerRadius - 0.05, diskInnerRadius - 0.05,
        rimWallHeight * 0.6, 128, 3, true
    );
    const innerRimMat = new THREE.MeshStandardMaterial({
        color: 0x994422,
        roughness: 0.4,
        metalness: 0.85,
        emissive: 0x551100,
        emissiveIntensity: 0.5
    });
    const innerRim = new THREE.Mesh(innerRimGeo, innerRimMat);
    innerRim.position.y = rimWallHeight * 0.3;
    innerRim.name = 'InnerRimWall_HeatShield';
    rimGroup.add(innerRim);

    diskGroup.add(rimGroup);

    // ========================================================================
    // SECTION 6: ATMOSPHERE DOME — Transparent shield above disk surface
    // ========================================================================
    const atmosphereGroup = new THREE.Group();
    atmosphereGroup.name = 'AtmosphereSystem';

    // Upper atmosphere dome (top side)
    const atmoDomeTopGeo = new THREE.SphereGeometry(diskOuterRadius + 0.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const atmoDomeTop = new THREE.Mesh(atmoDomeTopGeo, atmosphereShieldMat);
    atmoDomeTop.position.y = diskThickness / 2;
    atmoDomeTop.name = 'AtmosphereDome_Top';
    atmosphereGroup.add(atmoDomeTop);

    // Lower atmosphere dome (bottom side)
    const atmoDomeBottomGeo = new THREE.SphereGeometry(diskOuterRadius + 0.5, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const atmoDomeBottom = new THREE.Mesh(atmoDomeBottomGeo, atmosphereShieldMat);
    atmoDomeBottom.position.y = -diskThickness / 2;
    atmoDomeBottom.name = 'AtmosphereDome_Bottom';
    atmosphereGroup.add(atmoDomeBottom);

    diskGroup.add(atmosphereGroup);

    // ========================================================================
    // SECTION 7: DAY/NIGHT TERMINATOR — Moving shadow plane
    // ========================================================================
    const terminatorGroup = new THREE.Group();
    terminatorGroup.name = 'DayNightTerminator';

    // Semi-transparent shadow plane sweeping across the disk
    const shadowPlaneGeo = new THREE.PlaneGeometry(diskOuterRadius * 2.2, diskOuterRadius * 2.2);
    const shadowPlaneMat = new THREE.MeshStandardMaterial({
        color: 0x000011,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(diskOuterRadius * 0.5, diskThickness / 2 + 0.05, 0);
    shadowPlane.name = 'ShadowPlane';
    terminatorGroup.add(shadowPlane);

    // Terminator line (the boundary between lit and dark sides)
    const termLinePts = [];
    for (let i = 0; i <= 100; i++) {
        const y = -diskOuterRadius + (i / 100) * diskOuterRadius * 2;
        termLinePts.push(new THREE.Vector3(0, 0, y));
    }
    const termCurve = new THREE.CatmullRomCurve3(termLinePts);
    const termLineGeo = new THREE.TubeGeometry(termCurve, 60, 0.06, 8, false);
    const termLine = new THREE.Mesh(termLineGeo, terminatorLineMat);
    termLine.rotation.x = -Math.PI / 2;
    termLine.position.y = diskThickness / 2 + 0.06;
    termLine.name = 'TerminatorLine';
    terminatorGroup.add(termLine);

    diskGroup.add(terminatorGroup);

    // ========================================================================
    // SECTION 8: ORBITAL ELEVATORS — Space-to-surface transit columns
    // ========================================================================
    const elevatorsGroup = new THREE.Group();
    elevatorsGroup.name = 'OrbitalElevators';

    const elevatorCount = 8;
    for (let i = 0; i < elevatorCount; i++) {
        const elevGroup = new THREE.Group();
        const angle = (i / elevatorCount) * Math.PI * 2;
        const radius = diskInnerRadius + 6 + (i % 3) * 5;

        // Main cable
        const cableHeight = 8.0;
        const cableGeo = new THREE.CylinderGeometry(0.03, 0.03, cableHeight, 12);
        const cable = new THREE.Mesh(cableGeo, elevatorCableMat);
        cable.position.y = cableHeight / 2;
        cable.name = `ElevatorCable_${i}`;
        elevGroup.add(cable);

        // Support cables (3 per elevator)
        for (let s = 0; s < 3; s++) {
            const sAngle = (s / 3) * Math.PI * 2;
            const sCableGeo = new THREE.CylinderGeometry(0.01, 0.01, cableHeight * 0.9, 8);
            const sCable = new THREE.Mesh(sCableGeo, aluminum);
            sCable.position.set(
                Math.cos(sAngle) * 0.12,
                cableHeight * 0.45,
                Math.sin(sAngle) * 0.12
            );
            elevGroup.add(sCable);
        }

        // Counterweight at top
        const cwGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const cw = new THREE.Mesh(cwGeo, darkSteel);
        cw.position.y = cableHeight;
        cw.name = `Counterweight_${i}`;
        elevGroup.add(cw);

        // Elevator car (moving pod)
        const carGeo = new THREE.BoxGeometry(0.12, 0.06, 0.12);
        const car = new THREE.Mesh(carGeo, chrome);
        car.position.y = 2.0;
        car.name = `ElevatorCar_${i}`;
        elevGroup.add(car);

        // Base station
        const baseStationGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.15, 16);
        const baseStation = new THREE.Mesh(baseStationGeo, spaceportMat);
        baseStation.position.y = 0.075;
        elevGroup.add(baseStation);

        // Orbital station at top
        const orbStationGeo = new THREE.TorusGeometry(0.3, 0.05, 8, 24);
        const orbStation = new THREE.Mesh(orbStationGeo, dockingRingMat);
        orbStation.position.y = cableHeight - 0.5;
        orbStation.rotation.x = Math.PI / 2;
        orbStation.name = `OrbitalStation_${i}`;
        elevGroup.add(orbStation);

        elevGroup.position.set(
            Math.cos(angle) * radius,
            diskThickness / 2,
            Math.sin(angle) * radius
        );
        elevatorsGroup.add(elevGroup);
    }

    diskGroup.add(elevatorsGroup);

    // ========================================================================
    // SECTION 9: TRANSIT TUBE NETWORK — Intercity rapid transit
    // ========================================================================
    const transitGroup = new THREE.Group();
    transitGroup.name = 'TransitNetwork';

    // Connect cities with transit tubes (connect sequential pairs)
    for (let i = 0; i < Math.min(cityCount - 1, 12); i++) {
        const c1 = citiesGroup.children[i];
        const c2 = citiesGroup.children[(i + 1) % cityCount];
        if (!c1 || !c2) continue;

        const p1 = c1.position.clone();
        const p2 = c2.position.clone();
        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        mid.y += 0.8 + Math.random() * 0.5;

        const tubeCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(p1.x, diskThickness / 2 + 0.3, p1.z),
            new THREE.Vector3(mid.x, mid.y, mid.z),
            new THREE.Vector3(p2.x, diskThickness / 2 + 0.3, p2.z)
        );
        const tubeGeo = new THREE.TubeGeometry(tubeCurve, 40, 0.025, 8, false);
        const tube = new THREE.Mesh(tubeGeo, transitTubeMat);
        tube.name = `TransitTube_${i}_to_${i + 1}`;
        transitGroup.add(tube);

        // Transit pods (small spheres along tubes)
        for (let p = 0; p < 3; p++) {
            const t = (p + 1) / 4;
            const podPos = tubeCurve.getPointAt(t);
            const podGeo = new THREE.SphereGeometry(0.02, 8, 8);
            const podMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0x88aaff,
                emissiveIntensity: 2.0
            });
            const pod = new THREE.Mesh(podGeo, podMat);
            pod.position.copy(podPos);
            pod.name = `TransitPod_${i}_${p}`;
            transitGroup.add(pod);
        }
    }

    diskGroup.add(transitGroup);

    // ========================================================================
    // SECTION 10: STELLAR ENERGY COLLECTORS — Harvesting star energy
    // ========================================================================
    const collectorsGroup = new THREE.Group();
    collectorsGroup.name = 'StellarCollectors';

    const collectorCount = 20;
    for (let i = 0; i < collectorCount; i++) {
        const angle = (i / collectorCount) * Math.PI * 2;
        const radius = diskInnerRadius + 1.0;

        // Collector dish (parabolic approximation using LatheGeometry)
        const dishPts = [];
        for (let j = 0; j <= 10; j++) {
            const t = j / 10;
            dishPts.push(new THREE.Vector2(t * 0.4, t * t * 0.08));
        }
        const dishGeo = new THREE.LatheGeometry(dishPts, 16);
        const dish = new THREE.Mesh(dishGeo, solarCollectorMat);
        dish.position.set(
            Math.cos(angle) * radius,
            diskThickness / 2 + 0.3,
            Math.sin(angle) * radius
        );
        dish.lookAt(0, 0, 0);
        dish.name = `SolarCollector_${i}`;
        collectorsGroup.add(dish);

        // Energy conduit from collector to disk surface
        const conduitCurve = new THREE.LineCurve3(
            new THREE.Vector3(
                Math.cos(angle) * radius,
                diskThickness / 2 + 0.3,
                Math.sin(angle) * radius
            ),
            new THREE.Vector3(
                Math.cos(angle) * (radius + 2),
                diskThickness / 2 + 0.05,
                Math.sin(angle) * (radius + 2)
            )
        );
        const conduitGeo = new THREE.TubeGeometry(conduitCurve, 8, 0.015, 6, false);
        const conduitMat = new THREE.MeshStandardMaterial({
            color: 0x00ff88,
            emissive: 0x00cc66,
            emissiveIntensity: 1.5,
            transparent: true,
            opacity: 0.7
        });
        const conduit = new THREE.Mesh(conduitGeo, conduitMat);
        conduit.name = `EnergyConduit_${i}`;
        collectorsGroup.add(conduit);
    }

    diskGroup.add(collectorsGroup);

    // ========================================================================
    // SECTION 11: GRAVITY GENERATORS — Artificial gravity nodes embedded in disk
    // ========================================================================
    const gravityGroup = new THREE.Group();
    gravityGroup.name = 'GravityGenerators';

    const gravNodeCount = 12;
    for (let i = 0; i < gravNodeCount; i++) {
        const angle = (i / gravNodeCount) * Math.PI * 2;
        const radius = diskInnerRadius + 5 + (i % 3) * 6;

        // Gravity well housing
        const housingGeo = new THREE.TorusGeometry(0.3, 0.08, 12, 24);
        const housing = new THREE.Mesh(housingGeo, darkSteel);
        housing.position.set(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        );
        housing.rotation.x = Math.PI / 2;
        housing.name = `GravityHousing_${i}`;
        gravityGroup.add(housing);

        // Central gravity core (glowing)
        const coreGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const core = new THREE.Mesh(coreGeo, gravitySinkMat);
        core.position.set(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        );
        core.name = `GravityCore_${i}`;
        gravityGroup.add(core);

        // Gravity field indicator rings
        for (let r = 1; r <= 3; r++) {
            const fieldGeo = new THREE.TorusGeometry(0.3 + r * 0.15, 0.005, 8, 32);
            const fieldMat = gravitySinkMat.clone();
            fieldMat.opacity = 0.3 / r;
            const field = new THREE.Mesh(fieldGeo, fieldMat);
            field.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            field.rotation.x = Math.PI / 2;
            field.name = `GravityField_${i}_ring${r}`;
            gravityGroup.add(field);
        }
    }

    diskGroup.add(gravityGroup);

    // ========================================================================
    // SECTION 12: SPACEPORT DOCKING RINGS — For interstellar vessels
    // ========================================================================
    const spaceportsGroup = new THREE.Group();
    spaceportsGroup.name = 'Spaceports';

    for (let i = 0; i < 6; i++) {
        const spGroup = new THREE.Group();
        const angle = (i / 6) * Math.PI * 2;
        const radius = diskOuterRadius - 3;

        // Main docking ring
        const dockRingGeo = new THREE.TorusGeometry(0.6, 0.05, 12, 32);
        const dockRing = new THREE.Mesh(dockRingGeo, dockingRingMat);
        dockRing.rotation.x = Math.PI / 2;
        dockRing.position.y = 1.5;
        spGroup.add(dockRing);

        // Inner alignment ring
        const innerDockGeo = new THREE.TorusGeometry(0.35, 0.025, 8, 24);
        const innerDock = new THREE.Mesh(innerDockGeo, chrome);
        innerDock.rotation.x = Math.PI / 2;
        innerDock.position.y = 1.5;
        spGroup.add(innerDock);

        // Support pylons
        for (let p = 0; p < 4; p++) {
            const pa = (p / 4) * Math.PI * 2;
            const pylonGeo = new THREE.CylinderGeometry(0.02, 0.03, 1.5, 8);
            const pylon = new THREE.Mesh(pylonGeo, steel);
            pylon.position.set(Math.cos(pa) * 0.4, 0.75, Math.sin(pa) * 0.4);
            spGroup.add(pylon);
        }

        // Landing pad
        const padGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.03, 32);
        const pad = new THREE.Mesh(padGeo, spaceportMat);
        pad.position.y = 0.015;
        spGroup.add(pad);

        // Guidance lights
        for (let g = 0; g < 8; g++) {
            const ga = (g / 8) * Math.PI * 2;
            const guideLightGeo = new THREE.SphereGeometry(0.015, 8, 8);
            const guideLightMat = new THREE.MeshStandardMaterial({
                color: g % 2 === 0 ? 0x00ff00 : 0xff0000,
                emissive: g % 2 === 0 ? 0x00ff00 : 0xff0000,
                emissiveIntensity: 3.0
            });
            const guideLight = new THREE.Mesh(guideLightGeo, guideLightMat);
            guideLight.position.set(Math.cos(ga) * 0.55, 0.04, Math.sin(ga) * 0.55);
            spGroup.add(guideLight);
        }

        spGroup.position.set(
            Math.cos(angle) * radius,
            diskThickness / 2,
            Math.sin(angle) * radius
        );
        spGroup.name = `Spaceport_${i}`;
        spaceportsGroup.add(spGroup);
    }

    diskGroup.add(spaceportsGroup);

    // ========================================================================
    // SECTION 13: STRUCTURAL RADIAL SUPPORTS — Internal disk framework
    // ========================================================================
    const supportsGroup = new THREE.Group();
    supportsGroup.name = 'RadialSupports';

    const radialCount = 36;
    for (let i = 0; i < radialCount; i++) {
        const angle = (i / radialCount) * Math.PI * 2;
        const p1 = new THREE.Vector3(
            Math.cos(angle) * (diskInnerRadius + 0.5),
            0,
            Math.sin(angle) * (diskInnerRadius + 0.5)
        );
        const p2 = new THREE.Vector3(
            Math.cos(angle) * (diskOuterRadius - 0.5),
            0,
            Math.sin(angle) * (diskOuterRadius - 0.5)
        );
        const supportCurve = new THREE.LineCurve3(p1, p2);
        const supportGeo = new THREE.TubeGeometry(supportCurve, 4, 0.04, 6, false);
        const support = new THREE.Mesh(supportGeo, darkSteel);
        support.name = `RadialSupport_${i}`;
        supportsGroup.add(support);
    }

    // Concentric ring supports
    const ringRadii = [10, 14, 18, 22, 26];
    ringRadii.forEach((r, idx) => {
        const ringGeo = new THREE.TorusGeometry(r, 0.03, 6, 128);
        const ring = new THREE.Mesh(ringGeo, steel);
        ring.rotation.x = Math.PI / 2;
        ring.name = `ConcentricSupport_${idx}`;
        supportsGroup.add(ring);
    });

    diskGroup.add(supportsGroup);

    group.add(diskGroup);

    // ========================================================================
    // SECTION 14: AMBIENT LIGHTING SETUP
    // ========================================================================
    const ambientLight = new THREE.AmbientLight(0x334455, 0.3);
    group.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xfff8e0, 0x222244, 0.5);
    group.add(hemisphereLight);

    // ========================================================================
    // MESHES COLLECTION for animation
    // ========================================================================
    const meshes = {
        starCore,
        chromosphere,
        corona1,
        corona2,
        starGroup,
        diskGroup,
        shadowPlane,
        terminatorGroup,
        citiesGroup,
        elevatorsGroup,
        collectorsGroup,
        gravityGroup,
        spaceportsGroup,
        rimLightRing,
        rimLightMid,
        thermalShield,
        starLight,
        fillLight,
        transitGroup,
        atmosphereGroup
    };

    // ========================================================================
    // PARTS CATALOG — 20 highly detailed parts
    // ========================================================================
    const parts = [
        {
            name: 'Central Star',
            description: 'A G-type main sequence star positioned at the center hole of the disk, providing radiant energy to both faces. Surface temperature ~5,778 K with active prominences and sunspots.',
            material: 'Stellar plasma (hydrogen/helium fusion)',
            function: 'Primary energy source for the entire disk ecosystem; provides light, heat, and photosynthetic energy to habitable surfaces on both faces.',
            assemblyOrder: 1,
            connections: ['Thermal Shield Ring', 'Inner Rim Wall', 'Stellar Energy Collectors'],
            failureEffect: 'Complete civilization collapse — loss of all light, heat, and energy. Disk freezes to ~3K background temperature within weeks.',
            cascadeFailures: ['Thermal Shield Ring', 'Atmosphere System', 'Gravity Generators', 'All Biomes'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 15, z: 0 }
        },
        {
            name: 'Disk Body — Habitable Surface A (Top)',
            description: 'Upper habitable face of the Alderson Disk. Contains oceans, continents, mountain ranges, deserts, ice caps, and mega-cities. Area equivalent to ~2.8 × 10^17 km².',
            material: 'Exotic matter substrate with terraformed regolith topsoil',
            function: 'Primary habitable surface supporting trillions of inhabitants, biomes, agriculture, and industrial zones across an area billions of times Earth.',
            assemblyOrder: 2,
            connections: ['Disk Substrate', 'Rim Walls', 'Atmosphere System', 'Gravity Generators'],
            failureEffect: 'Catastrophic surface collapse; terrain fractures expose vacuum-facing substrate. Mass extinction on affected sectors.',
            cascadeFailures: ['Mega-Cities', 'Transit Network', 'Terrain Biomes'],
            originalPosition: { x: 0, y: 0.175, z: 0 },
            explodedPosition: { x: 0, y: 6, z: 0 }
        },
        {
            name: 'Disk Body — Habitable Surface B (Bottom)',
            description: 'Lower habitable face with independent biomes and civilizations. Receives light from below the disk plane via the central star.',
            material: 'Exotic matter substrate with engineered bio-layer',
            function: 'Secondary habitable surface doubling the effective living area; houses distinct civilizations and ecosystems.',
            assemblyOrder: 3,
            connections: ['Disk Substrate', 'Rim Walls', 'Atmosphere System'],
            failureEffect: 'Similar to Surface A failure but on the underside. Atmospheric blowout risk.',
            cascadeFailures: ['Atmosphere System', 'Gravity Generators'],
            originalPosition: { x: 0, y: -0.175, z: 0 },
            explodedPosition: { x: 0, y: -6, z: 0 }
        },
        {
            name: 'Disk Structural Substrate',
            description: 'The internal framework of the disk composed of exotic matter and computronium lattice. Must resist its own gravity across 1 AU of radial span.',
            material: 'Exotic matter with negative pressure equation of state; carbon nanotube macro-weave reinforcement at 10^14 Pa tensile strength',
            function: 'Provides structural integrity to the disk. Must counteract self-gravity, tidal stresses from the star, and dynamic loads from billions of km of surface.',
            assemblyOrder: 4,
            connections: ['Radial Supports', 'Concentric Supports', 'Both Surfaces'],
            failureEffect: 'Disk fractures along stress lines. Fragments would be planet-sized, causing gravitational chaos and total destruction.',
            cascadeFailures: ['Everything — total structural failure is non-recoverable'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 8 }
        },
        {
            name: 'Outer Rim Wall',
            description: 'A 2,500-km-tall wall encircling the disk outer edge at ~1 AU radius. Retains atmosphere against vacuum and provides edge radiation shielding.',
            material: 'Magnetically reinforced exotic alloy with ablative thermal coating',
            function: 'Atmosphere containment barrier; prevents atmospheric escape into interstellar space. Also serves as a radiation shield and structural edge stiffener.',
            assemblyOrder: 5,
            connections: ['Disk Edge', 'Atmosphere System', 'Buttresses'],
            failureEffect: 'Atmosphere vents into space at breach point. Creates massive low-pressure zone causing hypersonic winds toward breach.',
            cascadeFailures: ['Atmosphere System', 'Adjacent Mega-Cities', 'Spaceports'],
            originalPosition: { x: 0, y: 1.25, z: 0 },
            explodedPosition: { x: 8, y: 3, z: 0 }
        },
        {
            name: 'Inner Rim Wall — Heat Shield',
            description: 'A refractory wall lining the star hole. Withstands direct stellar radiation at close range and prevents thermal runaway of inner disk sectors.',
            material: 'Tungsten-hafnium-carbide composite with active cooling channels carrying liquid sodium',
            function: 'Thermal protection for the inner disk edge. Reflects and absorbs stellar radiation to prevent melting of the disk inner boundary.',
            assemblyOrder: 6,
            connections: ['Thermal Shield Ring', 'Central Star', 'Stellar Energy Collectors'],
            failureEffect: 'Inner disk edge begins to melt and ablate. Stellar wind penetrates disk substrate causing deep structural heating.',
            cascadeFailures: ['Disk Substrate', 'Stellar Energy Collectors', 'Inner Terrain Sectors'],
            originalPosition: { x: 0, y: 0.45, z: 0 },
            explodedPosition: { x: -5, y: 4, z: 0 }
        },
        {
            name: 'Thermal Shield Ring',
            description: 'A toroidal superconducting magnet array generating a magnetic field to deflect charged stellar wind particles away from the inner disk edge.',
            material: 'YBCO high-temperature superconductor with cryogenic cooling jackets',
            function: 'Generates a 10^8 Tesla magnetic field to create a stellar wind deflection barrier, analogous to a planetary magnetosphere.',
            assemblyOrder: 7,
            connections: ['Inner Rim Wall', 'Central Star', 'Energy Conduits'],
            failureEffect: 'Charged particle bombardment of inner disk. Radiation levels become lethal within 10^6 km of the star hole.',
            cascadeFailures: ['Inner Rim Wall', 'Inner Terrain Sectors', 'Stellar Collectors'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -3, y: 8, z: 0 }
        },
        {
            name: 'Atmosphere Containment Domes',
            description: 'Transparent energy barriers above and below the disk that retain a breathable N₂/O₂ atmosphere at 1 atm against gravitational and centrifugal escape.',
            material: 'Coherent force-field emitters (theoretical exotic-matter-stabilized electromagnetic barriers)',
            function: 'Maintains a habitable atmosphere across the disk surface without requiring impossibly deep gravity wells.',
            assemblyOrder: 8,
            connections: ['Rim Walls', 'Gravity Generators', 'Both Surfaces'],
            failureEffect: 'Atmosphere escapes into space. Decompression kills all unprotected life within minutes in affected sectors.',
            cascadeFailures: ['All surface biomes', 'Mega-Cities', 'Transit Network'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 10, z: 5 }
        },
        {
            name: 'Gravity Generators',
            description: '12 exotic-matter gravity nodes embedded throughout the disk substrate that generate 1g perpendicular to the disk surface on both faces.',
            material: 'Confined exotic matter with negative energy density (Casimir-effect stabilized)',
            function: 'Provides artificial gravity normal to the disk surface. Without these, the disk natural gravity would pull radially toward the center, not downward.',
            assemblyOrder: 9,
            connections: ['Disk Substrate', 'Both Surfaces', 'Power Grid'],
            failureEffect: 'Loss of surface gravity. All unsecured mass, atmosphere, and ocean water drifts off the surface. Immediate habitability loss.',
            cascadeFailures: ['Atmosphere System', 'All Biomes', 'Mega-Cities', 'Oceans'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 5, y: -3, z: 5 }
        },
        {
            name: 'Mega-Cities (16 Arcology Clusters)',
            description: 'Planet-sized urban agglomerations each housing trillions of inhabitants in kilometer-tall arcology towers with self-contained ecosystems.',
            material: 'Diamond-reinforced carbon nanotube framework with photovoltaic glass facades',
            function: 'Primary habitation, governance, industry, and culture centers. Each city is a self-sustaining civilization node connected via transit network.',
            assemblyOrder: 10,
            connections: ['Transit Network', 'Orbital Elevators', 'Power Grid', 'Disk Surface'],
            failureEffect: 'Arcology collapse kills trillions. Debris field covers thousands of km². Economic disruption propagates across the disk.',
            cascadeFailures: ['Transit Network', 'Local Spaceport', 'Regional Power Grid'],
            originalPosition: { x: 0, y: 0.175, z: 0 },
            explodedPosition: { x: 3, y: 5, z: -3 }
        },
        {
            name: 'Orbital Elevators (8 units)',
            description: 'Space elevator columns extending 8,000+ km above the disk surface, connecting surface cities to orbital docking stations and counterweight nodes.',
            material: 'Carbon nanotube ribbon with active vibration dampening systems',
            function: 'Mass-efficient transport of cargo and passengers between disk surface and orbital infrastructure. Eliminates need for chemical rockets.',
            assemblyOrder: 11,
            connections: ['Mega-Cities', 'Orbital Stations', 'Counterweights'],
            failureEffect: 'Cable snap causes a whiplash event. Falling cable wraps around the disk surface causing destruction along thousands of km path.',
            cascadeFailures: ['Attached Mega-City', 'Orbital Station', 'Local Transit'],
            originalPosition: { x: 0, y: 4, z: 0 },
            explodedPosition: { x: -5, y: 12, z: 3 }
        },
        {
            name: 'Transit Tube Network',
            description: 'A web of evacuated maglev tubes connecting all major cities at relativistic speeds. Tubes arc above the surface on support pylons.',
            material: 'Transparent aluminum tubes with superconducting maglev rails',
            function: 'Intercity rapid transit at 0.01c–0.1c. Enables practical travel across the disk despite distances measured in AU.',
            assemblyOrder: 12,
            connections: ['Mega-Cities', 'Spaceports', 'Power Grid'],
            failureEffect: 'Tube breach at relativistic speeds causes catastrophic decompression and debris spray. Transit pod impacts surface like a kinetic weapon.',
            cascadeFailures: ['Connected Cities', 'Passengers', 'Surface Infrastructure'],
            originalPosition: { x: 0, y: 0.5, z: 0 },
            explodedPosition: { x: 6, y: 3, z: -6 }
        },
        {
            name: 'Stellar Energy Collectors (20 units)',
            description: 'Parabolic dish arrays orbiting just outside the star hole, focusing stellar radiation into energy conduits feeding the disk power grid.',
            material: 'Molybdenum-rhenium alloy reflective dishes with photovoltaic secondary concentrators',
            function: 'Harvests ~10^26 watts of stellar luminosity (partial Dyson swarm function). Powers all disk systems including gravity generators.',
            assemblyOrder: 13,
            connections: ['Central Star', 'Energy Conduits', 'Power Grid', 'Thermal Shield'],
            failureEffect: 'Power deficit across multiple disk sectors. Gravity generators begin failing. Rolling blackouts cascade outward.',
            cascadeFailures: ['Gravity Generators', 'Mega-Cities', 'Transit Network'],
            originalPosition: { x: 0, y: 0.5, z: 0 },
            explodedPosition: { x: -8, y: 2, z: -2 }
        },
        {
            name: 'Spaceport Docking Rings (6 units)',
            description: 'Massive orbital docking facilities at the disk rim, each capable of simultaneously berthing hundreds of interstellar vessels.',
            material: 'Titanium-vanadium alloy framework with electromagnetic docking clamps',
            function: 'Interstellar trade and immigration hub. Provides customs, quarantine, fueling, and maintenance for incoming/outgoing vessels.',
            assemblyOrder: 14,
            connections: ['Outer Rim Wall', 'Transit Network', 'Orbital Elevators'],
            failureEffect: 'Loss of interstellar trade capability at affected sector. Fuel and resource shortages in connected cities within months.',
            cascadeFailures: ['Local Economy', 'Transit Network', 'Defense Grid'],
            originalPosition: { x: 0, y: 2, z: 0 },
            explodedPosition: { x: 10, y: 6, z: 0 }
        },
        {
            name: 'Day/Night Terminator System',
            description: 'A vast shadow-casting structure or orbital shade array that creates a moving day/night boundary across the disk surface for circadian rhythm support.',
            material: 'Ultra-thin carbon fiber shade panels with electrochromic opacity control',
            function: 'Simulates planetary day/night cycles for biological organisms. Terminator moves across the surface at configurable speed.',
            assemblyOrder: 15,
            connections: ['Central Star', 'Atmosphere System', 'Both Surfaces'],
            failureEffect: 'Permanent daylight or darkness in affected sectors. Ecosystem collapse, crop failure, psychological disorders in population.',
            cascadeFailures: ['Biomes', 'Agriculture', 'Population Health'],
            originalPosition: { x: 14, y: 0.225, z: 0 },
            explodedPosition: { x: 14, y: 8, z: 0 }
        },
        {
            name: 'Radial Structural Supports (36 spars)',
            description: 'Massive radial beams running from inner to outer rim within the disk substrate, distributing gravitational and rotational stresses.',
            material: 'Exotic matter-reinforced carbon lattice with active stress monitoring',
            function: 'Transfers loads from outer disk mass inward and prevents disk from tearing itself apart under differential rotation and tidal forces.',
            assemblyOrder: 16,
            connections: ['Disk Substrate', 'Concentric Supports', 'Both Rim Walls'],
            failureEffect: 'Disk develops fracture along failed spar. Sector-wide surface buckling and potential disk fragmentation.',
            cascadeFailures: ['Disk Substrate', 'Adjacent Supports', 'Surface Infrastructure'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -5, z: 8 }
        },
        {
            name: 'Concentric Ring Supports (5 rings)',
            description: 'Concentric structural rings at 5 radii within the disk, connecting all radial spars and distributing hoop stress.',
            material: 'Neutronium-density exotic matter compression members',
            function: 'Resists hoop stress from differential rotation. Prevents radial spars from splaying outward under centrifugal pseudo-forces.',
            assemblyOrder: 17,
            connections: ['Radial Supports', 'Disk Substrate'],
            failureEffect: 'Ring failure causes adjacent radial supports to buckle. Progressive failure propagates around the circumference.',
            cascadeFailures: ['Radial Supports', 'Disk Substrate', 'Surface Sectors'],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -8, z: 0 }
        },
        {
            name: 'Terrain Biomes (Oceans, Deserts, Mountains, Ice)',
            description: 'Engineered planetary-scale biomes across the disk surface including deep oceans, arid deserts, alpine mountain ranges, and polar ice cap analogs.',
            material: 'Terraformed regolith, imported cometary water, engineered soil microbiomes',
            function: 'Maintains ecological diversity, atmospheric gas cycling, water cycles, and food production across the habitable surface.',
            assemblyOrder: 18,
            connections: ['Disk Surface', 'Atmosphere System', 'Gravity Generators'],
            failureEffect: 'Biome collapse leads to atmospheric composition drift. CO₂/O₂ imbalance over centuries if not corrected.',
            cascadeFailures: ['Atmosphere composition', 'Agriculture', 'Water cycle'],
            originalPosition: { x: 0, y: 0.2, z: 0 },
            explodedPosition: { x: -6, y: 4, z: -6 }
        },
        {
            name: 'Rim Wall Buttresses (64 units)',
            description: 'Massive structural reinforcements on the exterior of the outer rim wall, preventing buckling under atmospheric pressure differential.',
            material: 'Graded-density exotic alloy with internal truss network',
            function: 'Transfers atmospheric pressure loads into the disk substrate. Prevents rim wall from bowing outward or collapsing.',
            assemblyOrder: 19,
            connections: ['Outer Rim Wall', 'Disk Edge', 'Radial Supports'],
            failureEffect: 'Local rim wall section bulges and potentially ruptures. Atmospheric breach at failure point.',
            cascadeFailures: ['Outer Rim Wall', 'Atmosphere System', 'Adjacent Buttresses'],
            originalPosition: { x: 0, y: 1.0, z: 0 },
            explodedPosition: { x: 10, y: 0, z: 10 }
        },
        {
            name: 'Rim Illumination System',
            description: 'Neon-bright photonic strips along the rim wall providing navigational reference and supplemental lighting for rim-adjacent sectors.',
            material: 'Photonic crystal waveguide strips powered by local solar collectors',
            function: 'Navigation aid for spacecraft, atmospheric aircraft, and rim-sector inhabitants. Also serves as a diagnostic indicator — color changes signal rim stress.',
            assemblyOrder: 20,
            connections: ['Outer Rim Wall', 'Power Grid', 'Spaceports'],
            failureEffect: 'Loss of navigational reference in rim sectors. Increased spacecraft collision risk. Diagnostic blind spot.',
            cascadeFailures: ['Spaceport Operations', 'Rim Sector Safety'],
            originalPosition: { x: 0, y: 2.5, z: 0 },
            explodedPosition: { x: 8, y: 8, z: 8 }
        }
    ];

    // ========================================================================
    // QUIZ QUESTIONS — 5 PhD-level structural engineering / astrophysics
    // ========================================================================
    const quizQuestions = [
        {
            question: 'An Alderson Disk has negligible thickness compared to its radius R. Using Gauss\'s law for gravity, derive the gravitational field g(z) experienced at height z above the disk surface at radial position r (where R_inner << r << R_outer). Why is this gravitational field fundamentally different from planetary surface gravity, and what engineering solution does the disk require?',
            options: [
                'g(z) = 2πGσ (constant, independent of z) — unlike planetary 1/r² gravity, the infinite-slab approximation gives uniform g. The disk needs no correction.',
                'g(z) = 2πGσ directed toward the disk plane — but this pulls mass radially inward toward the star, not "downward" to the surface. The disk requires artificial gravity generators to create a perpendicular component, since the natural field has zero normal component for objects ON the surface.',
                'g(z) = GM_disk/r² — the disk behaves like a point mass at the center, identical to a planet.',
                'g(z) = 0 everywhere — the disk is too thin to produce meaningful gravity. Only the star\'s gravity matters.'
            ],
            correct: 1,
            explanation: 'For an infinite flat slab, Gauss\'s law gives g = 2πGσ perpendicular to the slab. However, for a finite annular disk, the NET gravitational field at the surface has a strong radial component toward the center (star) but negligible normal component — objects would slide toward the star, not stick to the surface. The Alderson Disk requires exotic artificial gravity generators to produce the downward (surface-normal) gravitational acceleration needed for habitability. This is one of the fundamental engineering impossibilities of the concept.'
        },
        {
            question: 'The Alderson Disk extends from r₁ ≈ 0.1 AU to r₂ ≈ 1 AU around a solar-mass star. Calculate the Roche limit considerations: at what inner radius would tidal forces from the star exceed the self-gravitational binding of a disk element, and how does this constrain the disk\'s inner edge design?',
            options: [
                'The Roche limit is irrelevant because the disk is a rigid structure, not a self-gravitating fluid body.',
                'The Roche limit applies at r_Roche ≈ 2.46 R_star (ρ_star/ρ_disk)^(1/3). For a solar-type star and exotic-matter disk (ρ_disk ~ 10^4 kg/m³), r_Roche ≈ 0.01 AU. The inner edge at 0.1 AU is safely outside, but the disk must still resist differential tidal stretching (∂F_tidal/∂r) which scales as r⁻³.',
                'The Roche limit forces the inner edge to be at exactly 1 AU.',
                'Tidal forces are negligible compared to centrifugal forces at all radii.'
            ],
            correct: 1,
            explanation: 'The classical Roche limit d = 2.46 R_primary (ρ_primary/ρ_secondary)^(1/3) determines where tidal disruption exceeds self-gravity. For a Sun-like star (R = 0.00465 AU, ρ = 1408 kg/m³) and a disk with ρ ~ 10^4 kg/m³ exotic matter, d ≈ 0.006 AU — well inside the proposed inner edge. However, the disk is NOT a self-gravitating fluid; it\'s a rigid engineering structure that must resist tidal STRESS (σ_tidal ~ GM_star ρ_disk L / r³) across its radial extent L, requiring tensile strength exceeding 10^15 Pa — far beyond any known material, necessitating exotic matter.'
        },
        {
            question: 'Estimate the total mass of an Alderson Disk with inner radius 0.1 AU, outer radius 1.0 AU, and thickness 1000 km, constructed from material with mean density 5000 kg/m³. Compare this to stellar masses and explain why this presents a fundamental problem for the star\'s orbital stability.',
            options: [
                'M_disk ≈ 10^24 kg (about Earth mass) — negligible compared to the star. No stability issues.',
                'M_disk ≈ π(r₂² - r₁²) × h × ρ ≈ 3.14 × ((1.5×10¹¹)² - (1.5×10¹⁰)²) × 10⁶ × 5000 ≈ 3.5 × 10²⁹ kg — roughly 0.18 solar masses. This is significant: the star-disk system becomes a gravitational dipole problem where the star must sit at the precise center, but this equilibrium is unstable (Earnshaw\'s theorem analog). Any perturbation causes the star to drift and eventually collide with the inner rim.',
                'M_disk ≈ 10^35 kg — more massive than the star. The star orbits the disk.',
                'Mass is irrelevant because the disk is in free-fall around the star.'
            ],
            correct: 1,
            explanation: 'The disk area is π(r₂² - r₁²) ≈ 6.95 × 10²² m². With thickness 10⁶ m and density 5000 kg/m³, M_disk ≈ 3.5 × 10²⁹ kg ≈ 0.18 M_sun. This is a substantial fraction of a stellar mass. The star sitting at the center hole is in an unstable equilibrium: by Earnshaw\'s theorem (or its gravitational analog), a mass inside a ring/shell is at an unstable equilibrium — any displacement causes it to accelerate further from center. Active station-keeping (e.g., stellar engines) would be required to maintain the star\'s central position, consuming enormous energy.'
        },
        {
            question: 'The disk rotates slowly to provide (negligible) centrifugal pseudo-gravity. However, differential rotation is a critical problem: if the disk rotates rigidly, what is the maximum shear stress at the disk midpoint (r = 0.55 AU), and why does this make rigid rotation impossible with any known or theorized material?',
            options: [
                'Shear stress is zero for rigid rotation because all parts move together.',
                'The required centripetal acceleration for rigid rotation at radius r is a = ω²r. For ω sufficient to give 1g at 1 AU, the stress at the midpoint σ ≈ ρ ω² r² h / 2 ≈ 10^18 Pa — exceeding even theoretical carbon nanotube tensile strength (~10^11 Pa) by 7 orders of magnitude. Rigid rotation is impossible; the disk must either not rotate or use differential rotation with slip bearings.',
                'The shear stress is exactly equal to atmospheric pressure (10^5 Pa) because it must support the atmosphere.',
                'Shear stress is manageable at ~10^8 Pa, within range of advanced metamaterials.'
            ],
            correct: 1,
            explanation: 'For rigid rotation at angular velocity ω, a ring element at radius r requires centripetal force per unit volume = ρω²r. Integrating radially gives hoop stress σ ≈ ρω²r²/2. Even for a very slow rotation (ω ~ 10⁻⁷ rad/s, giving ~0.001g at 1 AU), σ at the midpoint ≈ 5000 × (10⁻⁷)² × (8×10¹⁰)² / 2 ≈ 1.6 × 10¹² Pa. For meaningful rotation, stresses reach 10^18 Pa. Carbon nanotube theoretical max is ~10^11 Pa. The disk cannot rotate rigidly — it would require exotic matter with negative-pressure equation of state, or Keplerian differential rotation with internal slip surfaces.'
        },
        {
            question: 'The disk must maintain a 1-atm breathable atmosphere on both faces. Calculate the total atmospheric mass required, the gravitational binding energy problem this creates, and explain why the atmosphere retention system is arguably the most challenging engineering problem of the entire megastructure.',
            options: [
                'Atmospheric mass ≈ surface area × 10^4 kg/m² (Earth atmosphere column mass) × 2 faces ≈ 1.4 × 10^27 kg. This is ~0.7 Jupiter masses of gas. The disk\'s natural gravity is radial (toward star), not surface-normal, so the atmosphere would flow along the surface toward the star and fall in. Retention requires: (1) artificial surface-normal gravity everywhere, (2) rim walls tall enough to exceed the atmosphere scale height (~8.5 km on Earth, but varies with local g), and (3) containment at the inner edge against stellar wind. The energy to maintain this against inevitable leakage is ~10^24 W — a significant fraction of total stellar luminosity.',
                'Atmospheric mass is negligible (~10^18 kg) and self-gravity holds it in place.',
                'The atmosphere naturally stays on the surface due to the disk\'s self-gravity.',
                'Atmosphere is unnecessary — inhabitants live in sealed habitats.'
            ],
            correct: 0,
            explanation: 'Earth\'s atmosphere has column mass ~10,300 kg/m². The disk habitable area (both faces) ≈ 2 × 6.95 × 10²² m² = 1.39 × 10²³ m². Total atmosphere mass ≈ 1.43 × 10²⁷ kg ≈ 0.75 M_Jupiter. This is an enormous gas mass that the disk\'s natural (radial) gravity cannot retain on the surface. Three simultaneous systems are needed: artificial gravity generators across the entire surface, rim walls exceeding the atmospheric scale height (which depends on local temperature and effective g), and inner-edge containment against stellar wind ablation. Any failure in any of these three systems causes catastrophic atmospheric loss — making atmosphere retention the single most challenging and failure-prone system of the Alderson Disk.'
        }
    ];

    // ========================================================================
    // DESCRIPTION
    // ========================================================================
    const description = `The Alderson Disk is a hypothetical megastructure proposed by Dan Alderson of 
Caltech — a colossal flat disk with a star threading through a hole at its center. The disk extends 
outward to approximately 1 AU (Earth's orbital radius), providing a habitable surface area billions 
of times greater than Earth on BOTH faces. This model features a multi-layered central star with 
solar prominences and sunspots, terrain biomes (oceans, deserts, mountains, ice caps), 16 mega-city 
arcology clusters, 64-buttressed rim walls for atmosphere retention, 8 orbital elevators with 
counterweights, a relativistic transit tube network, 20 stellar energy collectors, 12 artificial 
gravity generator nodes, 6 interstellar spaceport docking rings, and a moving day/night terminator 
system. The disk's structural framework includes 36 radial support spars and 5 concentric ring 
supports to resist the extraordinary gravitational and rotational stresses. This megastructure 
represents the extreme limit of theoretical structural engineering, requiring exotic matter and 
physics beyond current understanding.`;

    // ========================================================================
    // ANIMATE — Rich, highly synchronized animations
    // ========================================================================
    function animate(time, speed, refMeshes) {
        const t = time * speed;
        const m = refMeshes || meshes;

        // --- STAR PULSATION ---
        if (m.starCore) {
            const pulseFactor = 1.0 + 0.04 * Math.sin(t * 1.5) + 0.02 * Math.sin(t * 3.7);
            m.starCore.scale.setScalar(pulseFactor);
            m.starCore.material.emissiveIntensity = 3.0 + 1.5 * Math.sin(t * 2.0);
        }

        // Chromosphere pulsation (slightly delayed)
        if (m.chromosphere) {
            const chromePulse = 1.0 + 0.06 * Math.sin(t * 1.3 + 0.5);
            m.chromosphere.scale.setScalar(chromePulse);
            m.chromosphere.material.opacity = 0.4 + 0.15 * Math.sin(t * 1.8);
        }

        // Corona breathing
        if (m.corona1) {
            m.corona1.scale.setScalar(1.0 + 0.08 * Math.sin(t * 0.8));
            m.corona1.material.opacity = 0.25 + 0.15 * Math.sin(t * 1.2);
            m.corona1.rotation.y = t * 0.05;
        }

        if (m.corona2) {
            m.corona2.scale.setScalar(1.0 + 0.12 * Math.sin(t * 0.6 + 1.0));
            m.corona2.material.opacity = 0.08 + 0.06 * Math.sin(t * 0.9);
            m.corona2.rotation.y = -t * 0.03;
        }

        // Star rotation
        if (m.starGroup) {
            m.starGroup.rotation.y = t * 0.02;
        }

        // Star light intensity pulsation
        if (m.starLight) {
            m.starLight.intensity = 2.5 + 1.0 * Math.sin(t * 1.5);
        }
        if (m.fillLight) {
            m.fillLight.intensity = 0.8 + 0.4 * Math.sin(t * 1.8 + 0.3);
        }

        // --- DISK SLOW ROTATION ---
        if (m.diskGroup) {
            m.diskGroup.rotation.y = t * 0.003; // Very slow majestic rotation
        }

        // --- DAY/NIGHT TERMINATOR SWEEP ---
        if (m.terminatorGroup) {
            m.terminatorGroup.rotation.y = t * 0.015; // Sweeps around the disk
        }
        if (m.shadowPlane) {
            m.shadowPlane.material.opacity = 0.15 + 0.1 * Math.sin(t * 0.5);
        }

        // --- CITY LIGHTS TWINKLING ---
        if (m.citiesGroup) {
            m.citiesGroup.children.forEach((city, idx) => {
                city.children.forEach((child, cIdx) => {
                    if (child.material && child.material.emissive) {
                        if (child.material.emissiveIntensity !== undefined && child.material.color) {
                            const flicker = 0.5 + 0.5 * Math.sin(t * 3.0 + idx * 1.7 + cIdx * 0.3);
                            // Only adjust emissive intensity on light-emitting elements
                            if (child.material.emissiveIntensity > 1.0) {
                                child.material.emissiveIntensity = 1.5 + flicker * 1.5;
                            }
                        }
                    }
                });
            });
        }

        // --- ORBITAL ELEVATOR CARS MOVING UP/DOWN ---
        if (m.elevatorsGroup) {
            m.elevatorsGroup.children.forEach((elev, idx) => {
                elev.children.forEach(child => {
                    if (child.name && child.name.startsWith('ElevatorCar')) {
                        const elevCycle = Math.sin(t * 0.4 + idx * 0.8);
                        child.position.y = 1.0 + 3.0 * (elevCycle * 0.5 + 0.5); // Oscillate between 1 and 4
                    }
                });
                // Orbital station rings rotate
                elev.children.forEach(child => {
                    if (child.name && child.name.startsWith('OrbitalStation')) {
                        child.rotation.z = t * 0.5 + idx * 0.5;
                    }
                });
            });
        }

        // --- STELLAR COLLECTORS TRACKING ---
        if (m.collectorsGroup) {
            m.collectorsGroup.children.forEach((collector, idx) => {
                if (collector.name && collector.name.startsWith('SolarCollector')) {
                    // Subtle nodding motion as if tracking the star
                    collector.rotation.x += Math.sin(t * 0.3 + idx * 0.5) * 0.0005;
                }
                if (collector.name && collector.name.startsWith('EnergyConduit')) {
                    // Pulse the energy flow
                    if (collector.material) {
                        collector.material.emissiveIntensity = 1.0 + 1.0 * Math.sin(t * 2.0 + idx * 0.4);
                        collector.material.opacity = 0.5 + 0.3 * Math.sin(t * 2.5 + idx * 0.4);
                    }
                }
            });
        }

        // --- GRAVITY CORES PULSING ---
        if (m.gravityGroup) {
            m.gravityGroup.children.forEach((node, idx) => {
                if (node.name && node.name.startsWith('GravityCore')) {
                    const pulse = 1.0 + 0.15 * Math.sin(t * 2.0 + idx * 0.8);
                    node.scale.setScalar(pulse);
                    node.material.emissiveIntensity = 1.5 + 1.0 * Math.sin(t * 1.5 + idx * 0.6);
                }
                if (node.name && node.name.startsWith('GravityField')) {
                    node.rotation.z = t * 0.3 + idx * 0.2;
                    if (node.material) {
                        node.material.opacity = 0.15 + 0.1 * Math.sin(t * 1.0 + idx * 0.3);
                    }
                }
                if (node.name && node.name.startsWith('GravityHousing')) {
                    node.rotation.z = t * 0.2 + idx * 0.4;
                }
            });
        }

        // --- SPACEPORT DOCKING RINGS ROTATING ---
        if (m.spaceportsGroup) {
            m.spaceportsGroup.children.forEach((sp, idx) => {
                // Rotate the entire spaceport slowly
                sp.rotation.y = t * 0.1 + idx * 1.0;
                // Pulse guidance lights
                sp.children.forEach(child => {
                    if (child.material && child.material.emissiveIntensity > 2.0) {
                        child.material.emissiveIntensity = 2.0 + 2.0 * Math.abs(Math.sin(t * 4.0 + idx * 0.5));
                    }
                });
            });
        }

        // --- RIM LIGHTS PULSING ---
        if (m.rimLightRing) {
            m.rimLightRing.material.emissiveIntensity = 2.0 + 1.0 * Math.sin(t * 0.8);
        }
        if (m.rimLightMid) {
            m.rimLightMid.material.emissiveIntensity = 1.2 + 0.8 * Math.sin(t * 1.1 + 0.5);
        }

        // --- THERMAL SHIELD GLOW ---
        if (m.thermalShield) {
            m.thermalShield.material.emissiveIntensity = 0.8 + 0.6 * Math.sin(t * 0.6);
        }

        // --- TRANSIT POD MOVEMENT ---
        if (m.transitGroup) {
            m.transitGroup.children.forEach((child, idx) => {
                if (child.name && child.name.startsWith('TransitPod')) {
                    // Subtle movement along tubes
                    const wobble = Math.sin(t * 1.5 + idx * 2.0) * 0.05;
                    child.position.y += wobble * 0.01;
                    if (child.material) {
                        child.material.emissiveIntensity = 1.5 + 1.0 * Math.sin(t * 3.0 + idx);
                    }
                }
            });
        }

        // --- ATMOSPHERE DOME SHIMMER ---
        if (m.atmosphereGroup) {
            m.atmosphereGroup.children.forEach(dome => {
                if (dome.material) {
                    dome.material.opacity = 0.06 + 0.04 * Math.sin(t * 0.3);
                }
            });
        }
    }

    // ========================================================================
    // RETURN
    // ========================================================================
    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
