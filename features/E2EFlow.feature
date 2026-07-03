Feature: End-to-End Order Placement
@Regression
  Scenario: User searches product, adds to cart, places order and verifies in My Orders
    Given the user opens the Rahul Shetty Academy client application
    And User logins with username "yharsha0001@gmail.com" and password "Test@12345"
    When the user selects "iphone 13 pro" and adds it to the cart
    And the user navigates to cart and proceeds to checkout
    And the user enters payment details and selects country "India"
    Then the user should successfully place the order and verify it in My Orders
