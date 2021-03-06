import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from "reactstrap";
import { Panel, BoldTxt, Center } from "assets/css/adminStyle";
import { MdEast } from "react-icons/md";
import Alert from "react-bootstrap/Alert";
import ReactMoment from "react-moment";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import {
  ANNOUNCEMENT_DETAIL_QUERY,
  EXPECTEDCOST_WRITE_QUERY,
  ANNOUNCEMENT_LIST_QUERY,
  COMPLETE_ANNOUNCEMENT_MUTATION,
  DELETE_ANNOUNCEMENT_MUTATION,
} from "../../config/Queries";
import { toast } from "react-toastify";
import qs from "qs";
import NumberFormat from "react-number-format";

function AnnouncementView({ match, location }) {
  const [expectedCost, setExpectedCost] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const toggle = () => setIsModal(!isModal);
  const history = useHistory();
  const handleRowClick = (noticeCode) => {
    history.push("/admin/announcements");
  };
  const code = parseInt(match.params.id);
  const queryString = qs.parse(location.search.substr(1));
  const page = queryString.page ? queryString.page : 1;
  const blockSize = 5;
  const take = 10;
  const skip = take * (page - 1);

  const baseUrl = "?";

  const [status, setStatus] = useState(0);
  const { data, loading } = useQuery(ANNOUNCEMENT_DETAIL_QUERY, {
    variables: {
      code,
    },
    pollInterval: 10000,
  });
  const [expectedCostWriteMutation] = useMutation(EXPECTEDCOST_WRITE_QUERY, {
    refetchQueries: () => [
      {
        query: ANNOUNCEMENT_LIST_QUERY,
        variables: {
          status: 0,
          skip: 0,
          take: 10,
        },
      },
      {
        query: ANNOUNCEMENT_DETAIL_QUERY,
        variables: {
          code,
        },
      },
    ],
  });

  const onSubmit = async () => {
    try {
      const {
        data: { result },
      } = await expectedCostWriteMutation({
        variables: {
          code,
          expectedCost: parseInt(expectedCost),
        },
      });

      setIsModal(false);
    } catch (e) {
      console.log(e);
    }
  };
  const findCaregiver = (announcementApplication) => {
    if (announcementApplication.confirm === true) {
      return true;
    }
  };
  const caregiver =
    !loading &&
    data?.viewAnnouncement?.announcementApplication.find(findCaregiver);

  const [completeAnnouncement] = useMutation(COMPLETE_ANNOUNCEMENT_MUTATION, {
    variables: {
      code,
    },
    refetchQueries: () => [
      {
        query: ANNOUNCEMENT_DETAIL_QUERY,
        variables: {
          code,
        },
      },
    ],
  });
  const announcementComplete = () => {
    completeAnnouncement();
    setShowAlert(false);
    toast.success("?????? ????????? ?????????????????????.", {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  const [deleteAnnouncement] = useMutation(DELETE_ANNOUNCEMENT_MUTATION, {
    variables: {
      announcementCode: code,
    },
    refetchQueries: () => [
      {
        query: ANNOUNCEMENT_LIST_QUERY,
        variables: {
          status: status ? status : 0,
          skip,
          take,
        },
      },
    ],
  });
  const onDeleteClick = () => {
    deleteAnnouncement();
    toast.success("?????? ????????? ?????????????????????.", {
      autoClose: 3000,
      position: toast.POSITION.TOP_RIGHT,
    });
    history.push(`/admin/announcements`);
  };

  const nightsAndDays =
    (new Date(data?.viewAnnouncement?.endDate).getTime() -
      new Date(data?.viewAnnouncement?.startDate).getTime()) /
    (1000 * 60 * 60 * 24);

  return (
    <>
      {!loading && (
        <div className="content">
          <Panel panelHeadingTit="?????? ??????">
            <div className="form-group row">
              <label className="col-sm-3 control-label">?????? ??????</label>
              <div className="col-sm-9">{data?.viewAnnouncement?.title}</div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">?????? ??????</label>
              <div className="col-sm-9">
                <p>
                  ?????????: {data?.viewAnnouncement?.startDate}
                  <MdEast /> ?????????: {data?.viewAnnouncement?.endDate}
                  <BoldTxt>
                    ({nightsAndDays - 1}??? {nightsAndDays}???)
                  </BoldTxt>
                </p>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">
                ????????? ???????????????
              </label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.expectedCost ? (
                  <NumberFormat
                    value={data?.viewAnnouncement?.expectedCost}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"???"}
                    renderText={(formattedValue) => formattedValue}
                  />
                ) : (
                  "?????????"
                )}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">?????? ???????????????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.hopeCost ? (
                  <NumberFormat
                    value={data?.viewAnnouncement?.hopeCost}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"???"}
                    renderText={(formattedValue) => formattedValue}
                  />
                ) : (
                  "?????????"
                )}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">??? ????????????</label>
              <div className="col-sm-9">
                <NumberFormat
                  value={data?.viewAnnouncement?.confirmCost}
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix={"???"}
                  renderText={(formattedValue) => formattedValue}
                />
              </div>
            </div>
          </Panel>
          {caregiver?.user &&
            (data?.viewAnnouncement?.status === 4 ||
              data?.viewAnnouncement?.status === 5) && (
              <Panel panelHeadingTit="????????? ??????">
                <div className="form-group row">
                  <label className="col-sm-3 control-label">?????? ?????????</label>
                  <div className="col-sm-9">
                    {caregiver.user.userName}({caregiver.user.userId})
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-3 control-label">
                    ?????? ????????? ?????????
                  </label>
                  <div className="col-sm-9">{caregiver.user.phone}</div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-3 control-label">
                    ?????? ????????? ?????????
                  </label>
                  <div className="col-sm-9">
                    <NumberFormat
                      value={caregiver.caregiverCost}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix={"???"}
                      renderText={(formattedValue) => formattedValue}
                    />
                  </div>
                </div>
              </Panel>
            )}
          {!caregiver?.user &&
            (data?.viewAnnouncement?.status === 4 ||
              data?.viewAnnouncement?.status === 5) && (
              <Panel panelHeadingTit="????????? ??????">
                <div className="form-group row">
                  <label className="col-sm-3 control-label">?????? ?????????</label>
                  <div className="col-sm-9">
                    ????????? ?????????????????? ???????????? ???????????????.
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-3 control-label">
                    ?????? ????????? ?????????
                  </label>
                  <div className="col-sm-9">
                    ????????? ?????????????????? ???????????? ???????????????.
                  </div>
                </div>
              </Panel>
            )}
          <Panel panelHeadingTit="????????? ??????">
            <div className="form-group row">
              <label className="col-sm-3 control-label">????????? ??????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.protectorName}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">?????????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.protectorPhone.substr(0, 3) +
                  "-" +
                  data?.viewAnnouncement?.protectorPhone.substr(3, 4) +
                  "-" +
                  data?.viewAnnouncement?.protectorPhone.substr(7, 4)}
              </div>
            </div>
          </Panel>
          <Panel panelHeadingTit="?????? ?????? ??????">
            <div className="form-group row">
              <label className="col-sm-3 control-label">??????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.patientName}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">?????????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.user.phone.substr(0, 3) +
                  "-" +
                  data?.viewAnnouncement?.user.phone.substr(3, 4) +
                  "-" +
                  data?.viewAnnouncement?.user.phone.substr(7, 4)}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">??????</label>
              <div className="col-sm-9">{data?.viewAnnouncement?.user.sex}</div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">??????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.patientAge}???
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">?????????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.patientWeight}kg
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">??????????????????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.nursingGrade}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">??????????????? ??????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.address +
                  " " +
                  data?.viewAnnouncement?.addressDetail}
              </div>
            </div>
          </Panel>
          <Panel panelHeadingTit="?????? ?????? ??????">
            <div className="form-group row">
              <label className="col-sm-3 control-label">????????????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.needMealCare}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">????????? ??????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.needUrineCare}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">?????? ??????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.needSuctionCare}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">?????? ??????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.needMoveCare}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">?????? ??????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.needBedCare}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">?????? ??????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.needHygieneCare}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 control-label">????????? ??????</label>
              <div className="col-sm-9">
                {data?.viewAnnouncement?.caregiverMeal}
              </div>
            </div>
          </Panel>
          {data?.viewAnnouncement?.status == 4 && (
            <Center mt="50">
              <Button
                size="54"
                color="danger"
                onClick={() => {
                  setShowAlert(true);
                }}
              >
                ???????????? ??????
              </Button>
            </Center>
          )}
          {data?.viewAnnouncement?.status == 5 && (
            <Center mt="50">
              <Button size="54" color="green">
                ????????????
              </Button>
            </Center>
          )}
          {data?.viewAnnouncement?.status != 5 &&
            data?.viewAnnouncement?.status != 4 &&
            data?.viewAnnouncement?.status != 3 && (
              <Center mt="50">
                <Button size="54" color="danger" onClick={toggle}>
                  ??????????????? ??????
                </Button>
              </Center>
            )}
          <Row>
            <Col xs="6" sm="6" className="text-left">
              <Button
                onClick={() => {
                  handleRowClick();
                }}
                className="btn-white"
              >
                <i className="fa fa-list"></i>
                ??????
              </Button>
            </Col>
            <Col xs="6" sm="6" className="text-right">
              <Button
                onClick={() => {
                  setShowDeleteAlert(true);
                }}
                className="btn btn-white text-danger delete"
              >
                <i className="fas fa-trash"></i>
                ??????
              </Button>
            </Col>
          </Row>
          {showAlert && (
            <Alert variant="danger" className="m-t-20">
              <Alert.Heading>
                ?????? ????????? ????????? ??????????????? ??????????????????????
              </Alert.Heading>
              <p>
                ?????? ????????? ????????? ????????? ????????? ???????????? ??? ???????????????
                ???????????????.
              </p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  onClick={announcementComplete}
                  variant="outline-success"
                  className="m-r-5 btn-white"
                >
                  ??????
                </Button>
                <Button
                  onClick={() => setShowAlert(false)}
                  variant="outline-success"
                >
                  ??????
                </Button>
              </div>
            </Alert>
          )}
          {showDeleteAlert && (
            <Alert variant="danger" className="m-t-20">
              <Alert.Heading>?????? ????????? ?????????????????????????</Alert.Heading>
              <p>
                ????????? ????????? ?????? ????????? ????????? ??????????????? ?????????????????? ??????
                ???????????????. <br />
                ?????? ??? ????????? ????????? ?????????.
              </p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button
                  onClick={onDeleteClick}
                  variant="outline-success"
                  className="m-r-5 btn-white"
                >
                  ??????
                </Button>
                <Button
                  onClick={() => setShowAlert(false)}
                  variant="outline-success"
                >
                  ??????
                </Button>
              </div>
            </Alert>
          )}
          <Modal toggle={toggle} isOpen={isModal}>
            <form onSubmit={onSubmit}>
              <ModalHeader toggle={toggle}>??????????????? ??????</ModalHeader>
              <ModalBody>
                <NumberFormat
                  className="form-control"
                  name="expectedCost"
                  placeholder="??????????????? ??????"
                  thousandSeparator={true}
                  suffix={"???"}
                  onValueChange={(values) => {
                    const { formattedValue, value } = values;
                    setExpectedCost(value);
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  type="submit"
                  // onClick={!setIsModal}
                >
                  ??????
                </Button>
              </ModalFooter>
            </form>
          </Modal>
        </div>
      )}
    </>
  );
}

export default AnnouncementView;
