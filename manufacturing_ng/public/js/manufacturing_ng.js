frappe.ui.form.on('Work Order NG', {
    refresh: function(frm) {
        if(frm.doc.docstatus === 0) {
            frm.add_custom_button(__("Get items from Not Good"), function() {
                // show_sinv_dialog(frm);
                ng_dialog(frm);
                // NotGood
            });
		}
		
		// setTimeout(function(){
		// 	$(document).find('.ngitem_dialog input[type="checkbox"]').off();
		// 	$(document).on('click','.ngitem_dialog input[type="checkbox"]',function(){

				
		// 		var $this = $(this);
		// 		var item_code = $.trim($this.closest('.list-item').find('.list-item__content:eq(4)').text());
		// 		if ($(this).is(':checked')) {
		// 			console.log($(this).val() + ' is now checked');
		// 			$this.closest('.modal-dialog').find('input[data-fieldname="item_code"]').val(item_code);
		// 			$this.closest('.modal-dialog').find('input[data-fieldname="search_term"]').focus();
		// 			$this.closest('.modal-dialog').find('input[data-fieldname="search_term"]').trigger($.Event("keypress", { keyCode: 65 })); //spasi = 32
		// 			// $this.closest('.modal-dialog').find('input[data-fieldname="search_term"]').trigger($.Event("keypress", { keyCode: 8 }));

		// 		} else {
		// 			console.log($(this).val() + ' is now unchecked');
		// 			// $this.closest('.modal-dialog').find('input[data-fieldname="item_code"]').val('');
		// 		}
		// 	});
		// },1)
		
    }
}); 


// let manufacturing_ng = manufacturing_ng || {};

var NotGoodDialog = frappe.ui.form.MultiSelectDialog.extend({
	init: function(opts){
		this._super(opts);
	},
	render_result_list: function(results, more = 0) {
		this._super(results, more)
		
		this.dialog.$wrapper.find('.modal-dialog').css({'width': "90%"});
		this.dialog.$wrapper.find('.modal-dialog').addClass("ngitem_dialog");
	}
});


function ng_dialog(frm){
    // console.log(frm.doc)
	var ng_dialog = new NotGoodDialog({
		doctype: "Not Good",
		target: cur_frm,
		date_field: 'posting_date',
		setters: [
            {
				fieldname: "work_order", 
				fieldtype: "Data",
				options: "Work Order", 
				label: __("Work Order"),
				default: cur_frm.doc.work_order
            },
            {
				fieldname: "job_card", 
				fieldtype: "Data",
				options: "Job Card", 
				label: __("Job Card"),
				default: cur_frm.doc.job_card
            },
			{
				fieldname: "item_code", 
				fieldtype: "Data",
				options: "Item", 
				label: __("Item Code"),
				default: cur_frm.doc.item_code
            },
            {
				fieldname: "operation", 
				fieldtype: "Data",
				options: "Operation", 
				label: __("Operation"),
				default: cur_frm.doc.operation
			},
            // {
			// 	fieldname: "company", 
			// 	fieldtype: "Link",
			// 	options: "Company", 
			// 	label: __("Company"),
			// 	default: cur_frm.doc.company
			// },
            {
				fieldname: "employee", 
				fieldtype: "Data",
				options: "Employee", 
				label: __("Employee"),
				default: cur_frm.doc.employee
			},
			// {
			// 	fieldname: "posting_date",
			// 	fieldtype: "Date",
			// 	label: "Posting Date"
			// },
			{
				fieldname: "quantity",
				fieldtype: "Data",
				label: "Quantity"
			}
		],
		get_query_filters: function(){
			// console.log(1111111)
			return {
				filters: {
					// item_code: cur_frm.doc.item_code
				}
			}
		},
		action: function(selections, args) {
			if(selections.length === 0){
				frappe.msgprint(__("Please select Item"))
				return;
			}
			// console.log(selections)
			if($.isArray(cur_frm.doc.required_items) && cur_frm.doc.required_items.length > 0) {
				if(!cur_frm.doc.required_items[0].item_code) {
					cur_frm.doc.required_items = cur_frm.doc.required_items.splice(1);
				}
			}
            // console.log(cur_frm.doc.required_items)
			var item_table;
			var item_qty = 0;
			var item_code;
			var i = 0;
			var WO;
			$.each(selections, function(i, value){
				i++;
				frappe.model.with_doc("Not Good", value, function(){
                    var item = frappe.model.get_doc("Not Good", value);
					// console.log(item)
					WO = item.work_order;
                    item_code = item.item_code;
					item_qty += parseInt(item.quantity);
					// if(cur_frm.doc.required_items.filter((obj) => obj.item_code == item.item_code && obj.schedule_date == item.delivery_date).length == 0) {
					// 	item_table = cur_frm.add_child("required_items");
					// 	frappe.model.set_value(item_table.doctype, item_table.name, "item_code", item.item_code);
					// 	frappe.model.set_value(item_table.doctype, item_table.name, "qty", item.qty);
					// 	frappe.model.set_value(item_table.doctype, item_table.name, "schedule_date", item.delivery_date);
					// }
					// console.log(selections.length +' == '+ i);
					if(selections.length == i){						
						frappe.model.set_value('Work Order NG', frm.doc.name, "production_item", item_code);
						frappe.model.set_value('Work Order NG', frm.doc.name, "qty", item_qty);
					}
					
				})
			});
			// var woi = frappe.model.get_doc('Work Order Item')
			
			// console.log(frm.doc.required_items)

			var not_good_warehouse = '';
			setTimeout(function(){
				frappe.model.with_doc("Work Order", WO, function(){
					not_good_warehouse = frappe.model.get_value("Work Order", WO,'not_good_warehouse');
					// console.log(not_good_warehouse)
				})
			},1000)
			
			setTimeout(function(){
				$.each(frm.doc.required_items, function(k,val){
					frappe.model.set_value('Work Order Item', val.name, "source_warehouse", not_good_warehouse) // Not Good Warehouse					
				})
			},2000)

			ng_dialog.dialog.hide();
		}
	});
};


function show_sinv_dialog(frm) {
   frappe.prompt([
      {'fieldname': 'sales_invoice', 'fieldtype': 'Link', 'label': 'Sales Invoice', 'reqd': 1, 'Options': 'Sales Invoice'}  
   ],
   function(sales_invoice){
      get_items_from_sinv(sales_invoice);
   },
   'Get items from sales invoice',
   'Get items'
  )
}

function get_items_from_sinv(sales_invoice) {
  frappe.call({
    "method": "frappe.client.get",
    "args": {
        "doctype": "Sales Invoice",
        "name": sales_invoice
    },
    "callback": function(response) {
         // add items to your child table
         var sinv = response.message;
         sinv.items.forEach(function (item) {
             var child = cur_frm.add_child('items');
             frappe.model.set_value(child.doctype, child.name, 'item_code', item.item_code);
             frappe.model.set_value(child.doctype, child.name, 'qty', item.qty);
         });
         cur_frm.refresh_field('items');
     }
   });
}