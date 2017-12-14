# About IPT sync states

IPTs have a way of telling other machines how many occurrences they have per dataset. Be aware that this might require your IPT to be updated. See also [IPT Bug 1344](https://github.com/gbif/ipt/issues/1344)

This tool compares the IPT inventory with the number of occurrences in the GBIF index. If the two don't align then you should investigate why the synchronisation fails or get in touch with the GBIF secretariat.

##  How to use it
Enter the URL of your ipt (e.g. `http://maerua.iict.pt/ipt`). If your ipt supports the `/inventory/dataset` call then you should see a list of datasets  