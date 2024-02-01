import CustomerAddressUpdatedEvent from "../../customer/event/customer-address-updated.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import CustomerAddressUpdatedHandler from "../../customer/event/handler/customer-address-is-updated.handler";
import Event1CustomerIsCreatedHandler from "../../customer/event/handler/event1-customer-is-created.handler";
import Event2CustomerIsCreatedHandler from "../../customer/event/handler/event2-customer-is-created.handler";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify customers handlers when customer is created", () => {
    const eventDispatcher = new EventDispatcher();

    const log1Handler = new Event1CustomerIsCreatedHandler();
    const log2Handler = new Event2CustomerIsCreatedHandler();

    const spyLog1Handler = jest.spyOn(log1Handler, "handle");
    const spyLog2Handler = jest.spyOn(log2Handler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", log1Handler);
    eventDispatcher.register("CustomerCreatedEvent", log2Handler);

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Customer 1",
      email: "teste@gmail.com",
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyLog1Handler).toHaveBeenCalledWith(customerCreatedEvent);
    expect(spyLog2Handler).toHaveBeenCalledWith(customerCreatedEvent);
  });

  it("should notify customers handlers when customer address is updated", () => {
    const eventDispatcher = new EventDispatcher();

    const logHandler = new CustomerAddressUpdatedHandler();

    const spyLogHandler = jest.spyOn(logHandler, "handle");

    eventDispatcher.register("CustomerAddressUpdatedEvent", logHandler);

    const customerAddressUpdatedEvent = new CustomerAddressUpdatedEvent({
      id: 1,
      name: "Customer 1",
      address: new Address("Rua 1", 10, "São Leopoldo", "123"),
    });

    eventDispatcher.notify(customerAddressUpdatedEvent);

    expect(spyLogHandler).toHaveBeenCalledWith(customerAddressUpdatedEvent);
  });
});
