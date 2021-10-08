const OrderService = async (order, orderData, cart, req, res) => {
  let uid = req.query.uid;
  let responseList = [];
  await order
    .doc()
    .set(orderData)
    .then((data) => {
      console.log("order data", data);
      cart.get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          console.log("inside cart");
          console.log(doc.data().uid);
          console.log(orderData.uid);
          if (doc.data().userInfo.uid === orderData.uid) {
            let cartProduct = doc.data();
            cartProduct.products = [];
            cartProduct.quantity = 0;
            cartProduct.totalPrice = 0;
            cart // clearing the cart data after the order is successful
              .doc(doc.id)
              .update(cartProduct)
              .then((data) => {
                console.log("cart cleared");
              });
          }
        });
      });
    });
  return res.send("order inserted successfully");
};

const DeleteOrder = async (order, req, res) =>{
  let orderId = req.body.orderId;

  await order.get().then((ordersSnapshot)=>{
    ordersSnapshot.docs.forEach((orderData)=>{
         if(orderData.id === orderId){
          order.doc(orderData.id).delete().then((data)=>{
            res.send("Order removed successfully")
          })
        
         }
    })
  })
}

const UpdateOrder = async (order, req, res) =>{
  let orderId = req.body.orderId;
  let orderStat = req.body.orderStat

  await order.get().then((ordersSnapshot)=>{
    ordersSnapshot.docs.forEach((orderData)=>{
         if(orderData.id === orderId){
          console.log(orderId)
          order.doc(orderData.id).update({orderStatus:orderStat}).then((data)=>{
            res.send("Order status updated successfully")
          })
        
         }
    })
  })
  
}

const GetOrders = async (order, req, res) => {
  //let uid = req.query.uid;
  //console.log("we need to hjeck the uid", uid);
  let orderResponse = [];
  await order.orderBy('orderDate','desc').get().then((ordersSnapshot) => {
    ordersSnapshot.docs.forEach((order) => {
      let responseData = order.data();
      
      // if (uid === responseData.uid && responseData.orderStatus === "pending") {
        responseData.orderId = order.id;
        console.log("check order id id id", order.id);
        orderResponse.push(responseData);
     // }
    });
  });

  return res.send(orderResponse);
};

exports.addOrder = OrderService;
exports.getOrder = GetOrders;
exports.updateOrder = UpdateOrder;
exports.deleteOrder = DeleteOrder;
