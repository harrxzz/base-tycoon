import { describe, it } from "vitest";
import { createTestIndexer, type FactoryGame_BuildFinalized } from "envio";
import { TestHelpers } from "envio";

describe("FactoryGame contract BuildFinalized event tests", () => {
  it("FactoryGame_BuildFinalized is created correctly", async (t) => {
    const indexer = createTestIndexer();

    // Creating mock for FactoryGame contract BuildFinalized event
    const event = {
      contract: "FactoryGame" as const,
      event: "BuildFinalized" as const,
      params: {
        player: TestHelpers.Addresses.defaultAddress,
        stage: 0n,
        step: 0n,
      },
    };

    await indexer.process({
      chains: {
        84532: {
          simulate: [event],
        },
      },
    });

    // Getting the actual entity from the test indexer
    let actualFactoryGameBuildFinalized = await indexer.FactoryGame_BuildFinalized.getOrThrow("84532_0_0");

    // Creating the expected entity
    const expectedFactoryGameBuildFinalized: FactoryGame_BuildFinalized = {
      id: "84532_0_0",
      player: event.params.player,
      stage: event.params.stage,
      step: event.params.step,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    t.expect(actualFactoryGameBuildFinalized, "Actual FactoryGameBuildFinalized should be the same as the expected FactoryGameBuildFinalized").toEqual(expectedFactoryGameBuildFinalized);
  });
});

describe("Indexer smoke test", () => {
  it("processes the first block with events on chain 84532", async (t) => {
    const indexer = createTestIndexer();

    const result = await indexer.process({ chains: { 84532: {} } });

    t.expect(result.changes.length, "Should have at least one change").toBeGreaterThan(0);
    const firstChange = result.changes[0]!;
    t.expect(firstChange.chainId).toBe(84532);
    t.expect(firstChange.eventsProcessed).toBeGreaterThan(0);
  }, 60_000);
});
